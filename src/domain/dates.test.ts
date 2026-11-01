import { describe, expect, it } from 'vitest';
import { addDays, daysBetween, formatDate, startOfWeek, weekday } from './dates';

describe('dates', () => {
  it('adds days across month and year boundaries', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2027-03-01', -1)).toBe('2027-02-28');
  });

  it('counts days between dates, including across DST changes', () => {
    expect(daysBetween('2026-10-31', '2027-01-18')).toBe(79);
    expect(daysBetween('2027-03-20', '2027-03-30')).toBe(10);
    expect(daysBetween('2026-11-02', '2026-11-01')).toBe(-1);
  });

  it('uses Sunday as the first day of the week', () => {
    expect(weekday('2026-10-18')).toBe(0);
    expect(startOfWeek('2026-10-31')).toBe('2026-10-25');
    expect(startOfWeek('2026-10-25')).toBe('2026-10-25');
  });

  it('formats Israeli style', () => {
    expect(formatDate('2026-01-05')).toBe('5.1.2026');
  });
});
