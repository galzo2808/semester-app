import { describe, expect, it } from 'vitest';
import { daysSinceBackup, isBackupDue } from './backup';

const now = new Date('2026-11-20T12:00:00Z');

describe('backup reminder', () => {
  it('does not nag a fresh install', () => {
    expect(isBackupDue(undefined, false, now)).toBe(false);
  });
  it('reminds once there is progress and no backup', () => {
    expect(isBackupDue(undefined, true, now)).toBe(true);
  });
  it('reminds after 14 days', () => {
    expect(isBackupDue('2026-11-10T12:00:00Z', true, now)).toBe(false);
    expect(isBackupDue('2026-11-05T11:00:00Z', true, now)).toBe(true);
  });
  it('counts days since the last backup', () => {
    expect(daysSinceBackup('2026-11-18T13:00:00Z', now)).toBe(1);
    expect(daysSinceBackup(undefined, now)).toBeNull();
  });
});
