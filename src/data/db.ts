// IndexedDB database (via Dexie). The only file that knows the storage engine.
// Schema changes: add a new `this.version(n + 1).stores(...)` block with an
// upgrade function — never edit an existing version.
import Dexie, { type Table } from 'dexie';
import type {
  CalendarEvent,
  Course,
  CourseLink,
  Exam,
  Flashcard,
  FocusSession,
  Lesson,
  LessonChange,
  ReadingItem,
  Semester,
  Settings,
  StoredFile,
  Task,
  Topic,
} from '../domain/types';

export class AppDB extends Dexie {
  semesters!: Table<Semester, string>;
  courses!: Table<Course, string>;
  lessons!: Table<Lesson, string>;
  lessonChanges!: Table<LessonChange, string>;
  tasks!: Table<Task, string>;
  exams!: Table<Exam, string>;
  topics!: Table<Topic, string>;
  readings!: Table<ReadingItem, string>;
  files!: Table<StoredFile, string>;
  flashcards!: Table<Flashcard, string>;
  focusSessions!: Table<FocusSession, string>;
  calendarEvents!: Table<CalendarEvent, string>;
  links!: Table<CourseLink, string>;
  settings!: Table<Settings, string>;

  constructor(name = 'semester-app') {
    super(name);
    this.version(1).stores({
      semesters: 'id, startDate',
      courses: 'id, semesterId',
      lessons: 'id, courseId',
      tasks: 'id, courseId, dueDate, status, examId',
      exams: 'id, courseId, date',
      topics: 'id, courseId',
      readings: 'id, courseId',
      files: 'id',
      flashcards: 'id, courseId, nextReviewDate',
      focusSessions: 'id, taskId, courseId, startedAt',
      calendarEvents: 'id, start',
      settings: 'id',
    });
    this.version(2).stores({ links: 'id, courseId' });
    // v3: ReadingItem.required (boolean) became `requirement`.
    this.version(3)
      .stores({})
      .upgrade((tx) =>
        tx
          .table('readings')
          .toCollection()
          .modify((r) => {
            if (r.requirement === undefined) r.requirement = r.required ? 'required' : 'optional';
            delete r.required;
          }),
      );
    this.version(4).stores({ lessonChanges: 'id, date, courseId' });
  }
}

export const db = new AppDB();

export const newId = () => crypto.randomUUID();
export const nowStamp = () => new Date().toISOString();
