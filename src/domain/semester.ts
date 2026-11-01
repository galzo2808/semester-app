// Semester rules: week numbering, status, study days.
import { hasNoClasses } from './calendar';
import { daysBetween, startOfWeek, weekday, type ISODate } from './dates';
import type { CalendarEvent, Semester } from './types';

/** Syllabus week (1-based). Week 1 is the week containing the start date. Null outside the semester. */
export function semesterWeek(sem: Semester, date: ISODate): number | null {
  if (date < sem.startDate || date > sem.endDate) return null;
  return Math.floor(daysBetween(startOfWeek(sem.startDate), date) / 7) + 1;
}

export type SemesterStatus = 'before' | 'active' | 'between' | 'exams';

export function semesterStatus(sem: Semester, date: ISODate): SemesterStatus {
  if (date < sem.startDate) return 'before';
  if (date <= sem.endDate) return 'active';
  if (sem.examsStartDate && date >= sem.examsStartDate) return 'exams';
  return 'between';
}

/** A regular class day: listed in the semester's study days and not a holiday. */
export function isStudyDay(sem: Semester, date: ISODate, events: CalendarEvent[]): boolean {
  if (semesterWeek(sem, date) === null) return false;
  return sem.studyDays.includes(weekday(date)) && !hasNoClasses(date, events);
}
