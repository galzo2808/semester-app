// Full backup and restore of everything stored on this device, as one JSON file.
// The file is self-describing (format + schema version) so older backups can be restored later.
import { db as appDb, nowStamp, type AppDB } from './db';

export const BACKUP_FORMAT = 'semester-app-backup';
export const BACKUP_VERSION = 1;

/** Every table is backed up; the list is taken from the live schema so new tables are never missed. */
const tableNames = (database: AppDB) => database.tables.map((t) => t.name);

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  version: number;
  schemaVersion: number;
  appVersion: string;
  exportedAt: string;
  tables: Record<string, unknown[]>;
}

export type BackupError = 'not_json' | 'wrong_format' | 'newer_version' | 'broken';

export class BackupReadError extends Error {
  constructor(readonly code: BackupError) {
    super(code);
  }
}

// Blobs (summary files) cannot go into JSON directly: stored as data URLs and turned back on restore.
const BLOB_TAG = '__blob__';

async function encodeValue(value: unknown): Promise<unknown> {
  if (value instanceof Blob) {
    const buf = new Uint8Array(await value.arrayBuffer());
    let bin = '';
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    return { [BLOB_TAG]: true, type: value.type, data: btoa(bin) };
  }
  return value;
}

function decodeValue(value: unknown): unknown {
  if (value && typeof value === 'object' && (value as Record<string, unknown>)[BLOB_TAG]) {
    const { type, data } = value as { type: string; data: string };
    const bin = atob(data);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type });
  }
  return value;
}

async function encodeRow(row: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) out[k] = await encodeValue(v);
  return out;
}

const decodeRow = (row: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(row).map(([k, v]) => [k, decodeValue(v)]));

export async function createBackup(database: AppDB = appDb): Promise<BackupFile> {
  const tables: Record<string, unknown[]> = {};
  for (const name of tableNames(database)) {
    const rows = (await database.table(name).toArray()) as Record<string, unknown>[];
    tables[name] = await Promise.all(rows.map(encodeRow));
  }
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    schemaVersion: database.verno,
    appVersion: typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '',
    exportedAt: nowStamp(),
    tables,
  };
}

/** Parses and checks a backup file's text. Throws BackupReadError with a code the UI can explain. */
export function parseBackup(text: string, database: AppDB = appDb): BackupFile {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new BackupReadError('not_json');
  }
  const file = data as Partial<BackupFile>;
  if (!file || file.format !== BACKUP_FORMAT) throw new BackupReadError('wrong_format');
  if ((file.version ?? 0) > BACKUP_VERSION || (file.schemaVersion ?? 0) > database.verno) {
    throw new BackupReadError('newer_version');
  }
  if (!file.tables || typeof file.tables !== 'object') throw new BackupReadError('broken');
  for (const rows of Object.values(file.tables)) {
    if (!Array.isArray(rows) || rows.some((r) => !r || typeof r !== 'object' || !('id' in r))) {
      throw new BackupReadError('broken');
    }
  }
  if (!file.tables.settings?.length) throw new BackupReadError('broken');
  return file as BackupFile;
}

/**
 * Replaces all data on this device with the backup, in one transaction: if anything fails,
 * nothing changes. Tables the backup does not know (added in a newer app) are left empty.
 */
export async function restoreBackup(file: BackupFile, database: AppDB = appDb): Promise<void> {
  const names = tableNames(database);
  await database.transaction('rw', names.map((n) => database.table(n)), async () => {
    for (const name of names) {
      await database.table(name).clear();
      const rows = (file.tables[name] ?? []) as Record<string, unknown>[];
      if (rows.length) await database.table(name).bulkPut(rows.map(decodeRow));
    }
  });
}

export const backupFileName = (date: string) => `גיבוי-הסמסטר-שלי-${date}.json`;

/**
 * Saves the backup: the share sheet on phones (save to Files, Drive, WhatsApp…),
 * a regular download elsewhere. Returns false if the user closed the share sheet.
 */
export async function saveBackupFile(file: BackupFile, fileName: string): Promise<boolean> {
  const blob = new Blob([JSON.stringify(file)], { type: 'application/json' });
  const asFile = new File([blob], fileName, { type: 'application/json' });
  if (navigator.canShare?.({ files: [asFile] })) {
    try {
      await navigator.share({ files: [asFile] });
      return true;
    } catch (e) {
      if ((e as Error).name === 'AbortError') return false;
      // Fall through to a download if sharing is not allowed here.
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return true;
}
