import { beforeEach, describe, expect, it } from 'vitest';
import { BackupReadError, createBackup, parseBackup, restoreBackup } from './backup';
import { AppDB } from './db';
import { ensureSeeded } from './seed';

let db: AppDB;
beforeEach(async () => {
  db = new AppDB(`test-${crypto.randomUUID()}`);
  await ensureSeeded(db);
});

const code = (fn: () => unknown) => {
  try {
    fn();
  } catch (e) {
    return (e as BackupReadError).code;
  }
  return 'ok';
};

describe('backup', () => {
  it('restores everything exactly, including progress and a stored file', async () => {
    const reading = (await db.readings.toCollection().first())!;
    await db.readings.update(reading.id, { status: 'summarized', url: 'https://example.com/a' });
    await db.settings.update('app', { displayName: 'גל', gender: 'f', onboarded: true });
    await db.files.add({
      id: 'f1', name: 'סיכום.txt', mimeType: 'text/plain', size: 5, provider: 'local',
      blob: new Blob(['שלום'], { type: 'text/plain' }), createdAt: '', updatedAt: '',
    });
    const counts = async (d: AppDB) => Promise.all(d.tables.map((t) => t.count()));
    const before = await counts(db);

    const text = JSON.stringify(await createBackup(db));
    const other = new AppDB(`test-${crypto.randomUUID()}`);
    await ensureSeeded(other); // a phone that already has (different) data
    await restoreBackup(parseBackup(text, other), other);

    expect(await counts(other)).toEqual(before);
    expect((await other.readings.get(reading.id))?.status).toBe('summarized');
    expect((await other.settings.get('app'))?.displayName).toBe('גל');
    const file = (await other.files.get('f1'))!;
    expect(await file.blob!.text()).toBe('שלום');
  });

  it('explains files it cannot use, and changes nothing', async () => {
    expect(code(() => parseBackup('not json', db))).toBe('not_json');
    expect(code(() => parseBackup('{"format":"other"}', db))).toBe('wrong_format');
    expect(code(() => parseBackup(JSON.stringify({ format: 'semester-app-backup', version: 99, schemaVersion: 1, tables: {} }), db))).toBe('newer_version');
    expect(code(() => parseBackup(JSON.stringify({ format: 'semester-app-backup', version: 1, schemaVersion: 1, tables: { readings: [{}] } }), db))).toBe('broken');
    expect(await db.courses.count()).toBe(9);
  });
});
