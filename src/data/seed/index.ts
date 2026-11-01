// First-run data, applied in numbered steps so existing devices get new steps too.
// `seedVersion` in settings records the last step applied on this device.
//  1: semesters of תשפ״ז, the semester A courses, the academic calendar.
//  2: semester A readings, weekly topics, lecturers and summary links.
//  3: readings, topics and course details refreshed from the Moodle reading list (1.11.2026).
//  4: semester A weekly timetable, its known one-off changes, and exam dates.
import type { Course, CourseLink, Department, Exam, Lesson, LessonChange, ReadingItem, Semester, Settings, Topic } from '../../domain/types';
import { db, newId, nowStamp, type AppDB } from '../db';
import { CALENDAR_5787 } from './calendar5787';
import { EXAMS_5787A, EXTRA_EXAM_EVENTS_5787A, SCHEDULE_5787A, SCHEDULE_CHANGES_5787A } from './schedule5787a';
import { GENERAL_LINKS_5787, SYLLABUS_5787A } from './syllabus5787a';

export const SEED_VERSION = 4;

const SEMESTERS: Omit<Semester, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'sem-5787-a',
    name: 'תשפ״ז סמסטר א׳',
    yearLabel: 'תשפ״ז',
    term: 'a',
    startDate: '2026-10-18',
    endDate: '2027-01-17',
    examsStartDate: '2027-01-18',
    studyDays: [0, 2, 3, 4],
    archived: false,
  },
  {
    id: 'sem-5787-b',
    name: 'תשפ״ז סמסטר ב׳',
    yearLabel: 'תשפ״ז',
    term: 'b',
    startDate: '2027-02-28',
    endDate: '2027-06-11',
    examsStartDate: '2027-06-13',
    studyDays: [],
    archived: false,
  },
];

const COURSES_5787_A: [Department, string][] = [
  ['psych', 'מבוא לפסיכולוגיה'],
  ['psych', 'פסיכולוגיה חברתית א׳'],
  ['psych', 'פסיכולוגיה התפתחותית א׳'],
  ['psych', 'יסודות פיזיולוגיים של ההתנהגות א׳'],
  ['econ', 'מבוא לכלכלה א׳'],
  ['econ', 'מתמטיקה א׳'],
  ['econ', 'יסודות החשבונאות לכלכלנים'],
  ['econ', 'סטטיסטיקה א׳'],
  ['econ', 'יישומי מחשב'],
];

export const DEFAULT_SETTINGS: Settings = {
  id: 'app',
  seedVersion: SEED_VERSION,
  onboarded: false,
  gender: 'm',
  displayName: '',
  activeSemesterId: 'sem-5787-a',
  showCommunityHolidays: false,
  autoPlanDaysBefore: 14,
  pomodoro: { focus: 25, shortBreak: 5, longBreak: 15 },
};

export async function ensureSeeded(database: AppDB = db): Promise<void> {
  await database.transaction(
    'rw',
    [
      database.settings,
      database.semesters,
      database.courses,
      database.calendarEvents,
      database.readings,
      database.topics,
      database.links,
      database.lessons,
      database.lessonChanges,
      database.exams,
    ],
    async () => {
      const settings = await database.settings.get('app');
      const applied = settings?.seedVersion ?? 0;
      if (applied < 1) await seedBase(database);
      if (applied < 2) await seedSyllabus(database);
      if (applied < 3) await refreshCourseContent(database);
      if (applied < 4) await seedSchedule(database);
      if (applied < SEED_VERSION) {
        if (settings) await database.settings.update('app', { seedVersion: SEED_VERSION });
        else await database.settings.put(DEFAULT_SETTINGS);
      }
    },
  );
}

async function seedBase(database: AppDB) {
  const stamp = nowStamp();
  await database.semesters.bulkPut(SEMESTERS.map((s) => ({ ...s, createdAt: stamp, updatedAt: stamp })));
  const courses: Course[] = COURSES_5787_A.map(([department, name], order) => ({
    id: newId(),
    semesterId: 'sem-5787-a',
    name,
    department,
    order,
    createdAt: stamp,
    updatedAt: stamp,
  }));
  await database.courses.bulkAdd(courses);
  await database.calendarEvents.bulkPut(CALENDAR_5787);
}

const semesterACourses = (database: AppDB) => database.courses.where('semesterId').equals('sem-5787-a').toArray();

/** Summary links. Courses are matched by name, so a renamed or deleted course is skipped. */
async function seedSyllabus(database: AppDB) {
  const stamp = nowStamp();
  const base = { createdAt: stamp, updatedAt: stamp };
  const links: CourseLink[] = [];
  for (const course of await semesterACourses(database)) {
    (SYLLABUS_5787A[course.name]?.links ?? []).forEach((l, order) =>
      links.push({ ...l, ...base, id: newId(), courseId: course.id, order }),
    );
  }
  GENERAL_LINKS_5787.forEach((l, order) => links.push({ ...l, ...base, id: newId(), order }));
  await database.links.bulkAdd(links);
}

/** Same reading = same course, title and chapters. Used to carry a status/link across a refresh. */
const readingKey = (r: Pick<ReadingItem, 'courseId' | 'title' | 'chaptersOrPages'>) =>
  `${r.courseId}|${r.title}|${r.chaptersOrPages}`;

/**
 * Replaces readings and topics with the current syllabus content and updates lecturer, credits
 * and notes. Reading status, a user-added link and attached summaries are kept when the same item
 * still exists (matched by chapter number when the wording changed).
 */
async function refreshCourseContent(database: AppDB) {
  const stamp = nowStamp();
  const base = { createdAt: stamp, updatedAt: stamp };
  const courses = await semesterACourses(database);
  const ids = courses.map((c) => c.id);
  const previous = await database.readings.where('courseId').anyOf(ids).toArray();
  const byKey = new Map(previous.map((r) => [readingKey(r), r]));
  const chapter = (s: string) => s.match(/פרק \d+/)?.[0];
  const byChapter = new Map(previous.filter((r) => chapter(r.chaptersOrPages)).map((r) => [`${r.courseId}|${chapter(r.chaptersOrPages)}`, r]));

  const readings: ReadingItem[] = [];
  const topics: Topic[] = [];
  for (const course of courses) {
    const content = SYLLABUS_5787A[course.name];
    if (!content) continue;
    await database.courses.update(course.id, {
      lecturer: content.lecturer ?? course.lecturer,
      credits: content.credits ?? course.credits,
      notes: content.notes ?? course.notes,
      updatedAt: stamp,
    });
    for (const r of content.readings ?? []) {
      const key = { ...r, courseId: course.id };
      const ch = chapter(r.chaptersOrPages);
      const old = byKey.get(readingKey(key)) ?? (ch ? byChapter.get(`${course.id}|${ch}`) : undefined);
      readings.push({
        ...r,
        ...base,
        id: newId(),
        courseId: course.id,
        url: old?.url ?? r.url,
        status: old?.status ?? 'not_started',
        summaryFileIds: old?.summaryFileIds ?? [],
      });
    }
    for (const [week, title] of content.topics ?? []) {
      topics.push({ ...base, id: newId(), courseId: course.id, week, title, confidence: 0, reviews: [] });
    }
  }

  await database.readings.where('courseId').anyOf(ids).delete();
  await database.topics.where('courseId').anyOf(ids).delete();
  await database.readings.bulkAdd(readings);
  await database.topics.bulkAdd(topics);
}

async function seedSchedule(database: AppDB) {
  const stamp = nowStamp();
  const base = { createdAt: stamp, updatedAt: stamp };
  const courseId = new Map((await semesterACourses(database)).map((c) => [c.name, c.id]));
  const lessons: Lesson[] = [];
  for (const [weekday, startTime, endTime, course, kind, location] of SCHEDULE_5787A) {
    const id = courseId.get(course);
    if (id) lessons.push({ ...base, id: newId(), courseId: id, kind, weekday, startTime, endTime, location });
  }
  const changes: LessonChange[] = [];
  for (const c of SCHEDULE_CHANGES_5787A) {
    const id = courseId.get(c.course);
    if (!id) continue;
    if (c.kind === 'cancelled') {
      const wd = new Date(`${c.date}T12:00`).getDay();
      const lesson = lessons.find((l) => l.courseId === id && l.weekday === wd && l.startTime === c.start);
      if (lesson) changes.push({ ...base, id: newId(), date: c.date, courseId: id, kind: 'cancelled', lessonId: lesson.id });
    } else {
      changes.push({ ...base, id: newId(), date: c.date, courseId: id, kind: 'extra', startTime: c.start, endTime: c.end, location: c.location, note: c.note });
    }
  }
  const exams: Exam[] = [];
  for (const [course, moedA, moedB] of EXAMS_5787A) {
    const id = courseId.get(course);
    if (!id) continue;
    exams.push({ ...base, id: newId(), courseId: id, moed: 'a', date: moedA, attending: true });
    exams.push({ ...base, id: newId(), courseId: id, moed: 'b', date: moedB, attending: false });
  }
  await database.lessons.bulkAdd(lessons);
  await database.lessonChanges.bulkAdd(changes);
  await database.exams.bulkAdd(exams);
  await database.calendarEvents.bulkPut(EXTRA_EXAM_EVENTS_5787A);
}
