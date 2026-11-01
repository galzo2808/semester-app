import { describe, expect, it } from 'vitest';
import { formatBytes, he, inDays, t } from './he';

describe('i18n', () => {
  it('picks the gendered form', () => {
    expect(t('onboarding.start', 'm')).toBe('בוא נתחיל');
    expect(t('onboarding.start', 'f')).toBe('בואי נתחיל');
    expect(t('nav.today', 'f')).toBe('היום');
  });

  it('fills placeholders', () => {
    expect(t('today.helloName', 'm', { name: 'גל' })).toBe('שלום, גל');
  });

  it('every gendered entry has two different forms', () => {
    for (const v of Object.values(he)) {
      if (typeof v !== 'string') expect(v.m).not.toBe(v.f);
    }
  });

  it('phrases relative days naturally', () => {
    expect(inDays(0, 'm')).toBe('היום');
    expect(inDays(1, 'm')).toBe('מחר');
    expect(inDays(2, 'm')).toBe('בעוד יומיים');
    expect(inDays(79, 'm')).toBe('בעוד 79 ימים');
  });

  it('formats sizes in Hebrew units', () => {
    expect(formatBytes(5 * 1024 ** 2, 'm')).toBe('5.0 מ״ב');
  });
});
