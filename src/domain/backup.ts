// When to remind about backups. See docs/PLAN.md: reminder after 14 days without a backup.
export const BACKUP_REMINDER_DAYS = 14;

/**
 * Remind when the last backup is older than the limit, or when there is progress to lose
 * and no backup was ever made. A brand-new install with nothing entered is not nagged.
 */
export function isBackupDue(lastBackupAt: string | undefined, hasProgress: boolean, now: Date = new Date()): boolean {
  if (!lastBackupAt) return hasProgress;
  return now.getTime() - new Date(lastBackupAt).getTime() > BACKUP_REMINDER_DAYS * 86_400_000;
}

/** Whole days since the last backup, or null if never. */
export function daysSinceBackup(lastBackupAt: string | undefined, now: Date = new Date()): number | null {
  if (!lastBackupAt) return null;
  return Math.max(0, Math.floor((now.getTime() - new Date(lastBackupAt).getTime()) / 86_400_000));
}
