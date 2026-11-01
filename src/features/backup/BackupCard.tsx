import { useRef, useState } from 'react';
import { backupFileName, BackupReadError, createBackup, parseBackup, restoreBackup, saveBackupFile } from '../../data/backup';
import { updateSettings, useSettings } from '../../data/repos';
import { daysSinceBackup } from '../../domain/backup';
import { todayISO } from '../../domain/dates';
import type { StringKey } from '../../i18n/he';
import { useT } from '../../i18n/useT';
import { Card } from '../../ui/components';

type Status = { tone: 'ok' | 'error'; text: string } | null;

/** "עוד" screen: save a backup file, restore from one. */
export function BackupCard() {
  const { t } = useT();
  const settings = useSettings();
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const days = daysSinceBackup(settings?.lastBackupAt);
  const lastLine =
    days === null ? t('backup.never') : days === 0 ? t('backup.lastToday') : t('backup.lastDaysAgo', { n: days });

  const backup = async () => {
    setBusy(true);
    setStatus(null);
    try {
      const file = await createBackup();
      const saved = await saveBackupFile(file, backupFileName(todayISO()));
      if (saved) {
        await updateSettings({ lastBackupAt: file.exportedAt });
        setStatus({ tone: 'ok', text: t('backup.saved') });
      }
    } catch {
      setStatus({ tone: 'error', text: t('backup.saveFailed') });
    } finally {
      setBusy(false);
    }
  };

  const restore = async (picked: File | undefined) => {
    if (fileInput.current) fileInput.current.value = '';
    if (!picked) return;
    setStatus(null);
    try {
      const file = parseBackup(await picked.text());
      if (!window.confirm(t('backup.confirmRestore', { date: new Date(file.exportedAt).toLocaleDateString('he-IL') }))) return;
      setBusy(true);
      await restoreBackup(file);
      setStatus({ tone: 'ok', text: t('backup.restored') });
    } catch (e) {
      const code = e instanceof BackupReadError ? e.code : 'broken';
      setStatus({ tone: 'error', text: t(`backup.error.${code}` as StringKey) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title={t('backup.title')}>
      <div className="stack">
        <p className="muted small" style={{ margin: 0 }}>{t('backup.explain')}</p>
        <strong>{lastLine}</strong>
        <button className="btn primary block" disabled={busy} onClick={backup}>{t('backup.create')}</button>
        <button className="btn block" disabled={busy} onClick={() => fileInput.current?.click()}>
          {t('backup.restore')}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept=".json,application/json"
          hidden
          onChange={(e) => restore(e.target.files?.[0])}
        />
        {status && (
          <p role="status" className={status.tone === 'error' ? 'error-text' : 'ok-text'} style={{ margin: 0 }}>
            {status.text}
          </p>
        )}
      </div>
    </Card>
  );
}
