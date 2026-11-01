// Reading-log rules.
import type { ReadingItem, Requirement } from './types';

export const READING_STATUSES: ReadingItem['status'][] = ['not_started', 'reading', 'read', 'summarized'];

/** Tapping the status moves it one step forward, wrapping back to the start. */
export function nextReadingStatus(status: ReadingItem['status']): ReadingItem['status'] {
  return READING_STATUSES[(READING_STATUSES.indexOf(status) + 1) % READING_STATUSES.length];
}

export function readingCoversWeek(r: ReadingItem, week: number): boolean {
  if (r.syllabusWeek === undefined) return false;
  return week >= r.syllabusWeek && week <= (r.syllabusWeekEnd ?? r.syllabusWeek);
}

export const isReadingDone = (r: ReadingItem) => r.status === 'read' || r.status === 'summarized';

/** Lower comes first. Unverified sits right after required: it may well be mandatory. */
const PRIORITY: Record<Requirement, number> = { required: 0, unverified: 1, recommended: 2, optional: 3 };

export const byPriority = (a: ReadingItem, b: ReadingItem) => PRIORITY[a.requirement] - PRIORITY[b.requirement];

/** Open items for a syllabus week, most important first. Optional (רשות) items stay in the course page only. */
export function readingsForWeek<T extends ReadingItem>(items: T[], week: number): T[] {
  return items
    .filter((r) => r.requirement !== 'optional' && readingCoversWeek(r, week) && !isReadingDone(r))
    .sort(byPriority);
}
