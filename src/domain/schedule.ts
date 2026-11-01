// Timetable rules: which lessons happen on a given date.
import { hasNoClasses } from './calendar';
import { weekday, type ISODate } from './dates';
import { semesterWeek } from './semester';
import type { CalendarEvent, Lesson, LessonChange, Semester } from './types';

export interface DayLesson {
  key: string;
  courseId: string;
  kind: Lesson['kind'];
  startTime: string;
  endTime: string;
  location: string;
  cancelled: boolean;
  /** An added one-off lesson (make-up class etc.). */
  extra: boolean;
  note?: string;
}

/**
 * Lessons on `date`: regular weekly lessons inside the semester, minus holidays, with one-off
 * changes applied. Cancelled lessons stay in the list (marked) so the change is visible.
 */
export function lessonsOn(
  date: ISODate,
  semester: Semester,
  lessons: Lesson[],
  changes: LessonChange[],
  events: CalendarEvent[],
): DayLesson[] {
  if (semesterWeek(semester, date) === null || hasNoClasses(date, events)) return [];
  const todays = changes.filter((c) => c.date === date);
  const cancelled = new Set(todays.filter((c) => c.kind === 'cancelled').map((c) => c.lessonId));

  const regular: DayLesson[] = lessons
    .filter((l) => l.weekday === weekday(date))
    .map((l) => ({
      key: l.id,
      courseId: l.courseId,
      kind: l.kind,
      startTime: l.startTime,
      endTime: l.endTime,
      location: l.location,
      cancelled: cancelled.has(l.id),
      extra: false,
      note: todays.find((c) => c.lessonId === l.id)?.note,
    }));
  const extras: DayLesson[] = todays
    .filter((c) => c.kind === 'extra' && c.startTime && c.endTime)
    .map((c) => ({
      key: c.id,
      courseId: c.courseId,
      kind: 'lecture',
      startTime: c.startTime!,
      endTime: c.endTime!,
      location: c.location ?? '',
      cancelled: false,
      extra: true,
      note: c.note,
    }));
  return [...regular, ...extras].sort((a, b) => a.startTime.localeCompare(b.startTime));
}
