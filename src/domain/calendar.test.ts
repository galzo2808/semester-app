import { describe, expect, it } from 'vitest';
import { CALENDAR_5787 } from '../data/seed/calendar5787';
import { eventsOn, hasNoClasses, upcomingEvents } from './calendar';

describe('calendar', () => {
  it('matches multi-day events on any day in range', () => {
    expect(hasNoClasses('2027-04-25', CALENDAR_5787)).toBe(true);
    expect(hasNoClasses('2027-04-29', CALENDAR_5787)).toBe(false);
  });

  it('hides community holidays unless asked', () => {
    expect(eventsOn('2026-11-09', CALENDAR_5787)).toHaveLength(0);
    expect(eventsOn('2026-11-09', CALENDAR_5787, true).map((e) => e.title)).toEqual(['חג הסיגד']);
  });

  it('lists upcoming events in order, including ones already running', () => {
    const list = upcomingEvents('2027-04-23', CALENDAR_5787, 20);
    expect(list[0].title).toBe('חופשת פסח');
    expect(list.map((e) => e.start)).toEqual([...list.map((e) => e.start)].sort());
  });
});
