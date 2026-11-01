// Academic-calendar rules: which events fall on a date, what is coming up.
import { addDays, type ISODate } from './dates';
import type { CalendarEvent } from './types';

export function eventCovers(e: CalendarEvent, date: ISODate): boolean {
  return date >= e.start && date <= (e.end ?? e.start);
}

const visible = (e: CalendarEvent, includeCommunity: boolean) =>
  includeCommunity || e.kind !== 'community';

export function eventsOn(
  date: ISODate,
  events: CalendarEvent[],
  includeCommunity = false,
): CalendarEvent[] {
  return events.filter((e) => visible(e, includeCommunity) && eventCovers(e, date));
}

export function hasNoClasses(date: ISODate, events: CalendarEvent[]): boolean {
  return events.some((e) => e.kind === 'no_classes' && eventCovers(e, date));
}

/** Events that overlap [from, from + withinDays], sorted by start. */
export function upcomingEvents(
  from: ISODate,
  events: CalendarEvent[],
  withinDays: number,
  includeCommunity = false,
): CalendarEvent[] {
  const until = addDays(from, withinDays);
  return events
    .filter((e) => visible(e, includeCommunity))
    .filter((e) => (e.end ?? e.start) >= from && e.start <= until)
    .sort((a, b) => a.start.localeCompare(b.start));
}
