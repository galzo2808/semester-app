// Read/write functions and live React hooks for every entity.
// Screens use only these — never `db` directly.
import { useLiveQuery } from 'dexie-react-hooks';
import type { DayLesson } from '../domain/schedule';
import type { ReadingItem, Semester, Settings } from '../domain/types';
import { db, newId, nowStamp } from './db';

// ---- Settings ----
export function useSettings(): Settings | undefined {
  return useLiveQuery(() => db.settings.get('app'));
}

export async function updateSettings(patch: Partial<Omit<Settings, 'id'>>): Promise<void> {
  await db.settings.update('app', patch);
}

// ---- Semesters ----
export function useSemesters(): Semester[] | undefined {
  return useLiveQuery(() => db.semesters.orderBy('startDate').toArray());
}

export function useActiveSemester(): Semester | undefined {
  return useLiveQuery(async () => {
    const s = await db.settings.get('app');
    return s ? db.semesters.get(s.activeSemesterId) : undefined;
  });
}

export async function updateSemester(id: string, patch: Partial<Omit<Semester, 'id'>>): Promise<void> {
  await db.semesters.update(id, { ...patch, updatedAt: nowStamp() });
}

// ---- Courses ----
export function useCourses(semesterId: string | undefined) {
  return useLiveQuery(
    async () =>
      semesterId ? (await db.courses.where('semesterId').equals(semesterId).sortBy('order')) : [],
    [semesterId],
  );
}

export function useCourse(id: string | undefined) {
  return useLiveQuery(async () => (id ? (await db.courses.get(id)) ?? null : null), [id]);
}

// ---- Academic calendar ----
export function useCalendarEvents() {
  return useLiveQuery(() => db.calendarEvents.orderBy('start').toArray());
}

// ---- Reading log ----
export function useReadings(courseId: string | undefined) {
  return useLiveQuery(
    async () => (courseId ? db.readings.where('courseId').equals(courseId).sortBy('syllabusWeek') : []),
    [courseId],
  );
}

/** All reading items of a semester, with the course name attached. */
export function useSemesterReadings(semesterId: string | undefined) {
  return useLiveQuery(async () => {
    if (!semesterId) return [];
    const courses = await db.courses.where('semesterId').equals(semesterId).toArray();
    const names = new Map(courses.map((c) => [c.id, c.name]));
    const items = await db.readings.where('courseId').anyOf([...names.keys()]).toArray();
    return items.map((r) => ({ ...r, courseName: names.get(r.courseId) ?? '' }));
  }, [semesterId]);
}

/** Empty string removes the link. */
export async function setReadingUrl(id: string, url: string): Promise<void> {
  await db.readings.update(id, { url: url || undefined, updatedAt: nowStamp() });
}

export async function setReadingStatus(id: string, status: ReadingItem['status']): Promise<void> {
  await db.readings.update(id, { status, updatedAt: nowStamp() });
}

// ---- Topics ----
export function useTopics(courseId: string | undefined) {
  return useLiveQuery(
    async () => (courseId ? db.topics.where('courseId').equals(courseId).sortBy('week') : []),
    [courseId],
  );
}

// ---- Links (summaries, folders, general info) ----
export function useCourseLinks(courseId: string | undefined) {
  return useLiveQuery(
    async () => (courseId ? db.links.where('courseId').equals(courseId).sortBy('order') : []),
    [courseId],
  );
}

export function useGeneralLinks() {
  return useLiveQuery(() => db.links.filter((l) => !l.courseId).sortBy('order'));
}

// ---- Timetable ----
/** Regular lessons and one-off changes of a semester, plus course names for display. */
export function useTimetable(semesterId: string | undefined) {
  return useLiveQuery(async () => {
    if (!semesterId) return { lessons: [], changes: [], courseNames: new Map<string, string>() };
    const courses = await db.courses.where('semesterId').equals(semesterId).toArray();
    const ids = courses.map((c) => c.id);
    const [lessons, changes] = await Promise.all([
      db.lessons.where('courseId').anyOf(ids).toArray(),
      db.lessonChanges.where('courseId').anyOf(ids).toArray(),
    ]);
    return { lessons, changes, courseNames: new Map(courses.map((c) => [c.id, c.name])) };
  }, [semesterId]);
}

export function useCourseLessons(courseId: string | undefined) {
  return useLiveQuery(
    async () => (courseId ? db.lessons.where('courseId').equals(courseId).toArray() : []),
    [courseId],
  );
}

// ---- Exams ----
/** Exams of a semester, sorted by date, with the course name attached. */
export function useSemesterExams(semesterId: string | undefined) {
  return useLiveQuery(async () => {
    if (!semesterId) return [];
    const courses = await db.courses.where('semesterId').equals(semesterId).toArray();
    const names = new Map(courses.map((c) => [c.id, c.name]));
    const exams = await db.exams.where('courseId').anyOf([...names.keys()]).sortBy('date');
    return exams.map((e) => ({ ...e, courseName: names.get(e.courseId) ?? '' }));
  }, [semesterId]);
}

/**
 * Marks a regular lesson as cancelled on one date, or restores it. For a one-off extra lesson
 * this removes it.
 */
export async function toggleLessonCancelled(date: string, lesson: DayLesson): Promise<void> {
  if (lesson.extra) {
    await db.lessonChanges.delete(lesson.key);
    return;
  }
  const existing = await db.lessonChanges
    .where('date')
    .equals(date)
    .filter((c) => c.kind === 'cancelled' && c.lessonId === lesson.key)
    .first();
  if (existing) await db.lessonChanges.delete(existing.id);
  else {
    const stamp = nowStamp();
    await db.lessonChanges.add({
      id: newId(),
      date,
      courseId: lesson.courseId,
      kind: 'cancelled',
      lessonId: lesson.key,
      createdAt: stamp,
      updatedAt: stamp,
    });
  }
}

