// Data model for the whole app. See docs/PLAN.md, section 2.
// Entities used by later stages are defined now so the DB schema stays stable.
import type { ISODate } from './dates';

export type Gender = 'm' | 'f';
export type Department = 'econ' | 'psych';
export type Term = 'a' | 'b' | 'summer';

interface Base {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Semester extends Base {
  name: string; // "תשפ״ז סמסטר א׳"
  yearLabel: string; // "תשפ״ז"
  term: Term;
  startDate: ISODate;
  endDate: ISODate;
  examsStartDate?: ISODate;
  /** Weekdays with classes, 0 = Sunday. */
  studyDays: number[];
  archived: boolean;
}

export interface Course extends Base {
  semesterId: string;
  name: string;
  department: Department;
  order: number;
  lecturer?: string;
  credits?: number;
  notes?: string;
}

export interface Lesson extends Base {
  courseId: string;
  kind: 'lecture' | 'practice' | 'lab';
  weekday: number;
  startTime: string; // "10:00"
  endTime: string;
  location: string;
}

/** A one-off change to the regular timetable. */
export interface LessonChange extends Base {
  date: ISODate;
  courseId: string;
  kind: 'cancelled' | 'extra';
  /** For 'cancelled': which regular lesson. */
  lessonId?: string;
  /** For 'extra': when and where. */
  startTime?: string;
  endTime?: string;
  location?: string;
  note?: string;
}

export type TaskType = 'assignment' | 'exercise' | 'quiz' | 'study';

export interface Task extends Base {
  courseId: string;
  title: string;
  type: TaskType;
  gradeWeight?: number;
  dueDate: ISODate;
  dueTime?: string;
  estimateHours?: number;
  status: 'todo' | 'done';
  manualMinutes: number;
  isExamPrerequisite: boolean;
  source: 'manual' | 'auto-exam';
  examId?: string;
}

export interface Exam extends Base {
  courseId: string;
  moed: 'a' | 'b';
  date: ISODate;
  time?: string;
  location?: string;
  notes?: string;
  attending: boolean;
}

export interface Topic extends Base {
  courseId: string;
  week: number;
  title: string;
  /** 0 = not rated yet. */
  confidence: 0 | 1 | 2 | 3 | 4 | 5;
  reviews: { date: ISODate; confidenceAfter: number; note?: string }[];
}

/** As stated in the syllabus; 'unverified' when the syllabus does not say. */
export type Requirement = 'required' | 'optional' | 'recommended' | 'unverified';

export interface ReadingItem extends Base {
  courseId: string;
  kind: 'book' | 'article' | 'media';
  title: string;
  author: string;
  requirement: Requirement;
  chaptersOrPages: string;
  syllabusWeek?: number;
  /** Last week when the item spans several weeks. */
  syllabusWeekEnd?: number;
  notes?: string;
  status: 'not_started' | 'reading' | 'read' | 'summarized';
  url?: string;
  summaryFileIds: string[];
}

export type LinkCategory = 'exam' | 'reading' | 'lectures' | 'practice' | 'folder' | 'general';

/** An external resource (Drive summary, folder, website). No courseId = general link. */
export interface CourseLink extends Base {
  courseId?: string;
  title: string;
  url: string;
  category: LinkCategory;
  source?: string;
  note?: string;
  /** Display order within its list. */
  order: number;
}

export interface StoredFile extends Base {
  name: string;
  note?: string;
  mimeType: string;
  size: number;
  provider: 'local' | 'drive';
  driveFileId?: string;
  blob?: Blob;
  extractedText?: string;
}

export interface Flashcard extends Base {
  courseId: string;
  topicId?: string;
  front: string;
  back: string;
  box: 1 | 2 | 3 | 4 | 5;
  nextReviewDate: ISODate;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  courseId?: string;
  startedAt: string;
  durationMinutes: number;
  kind: 'focus' | 'break';
}

export type CalendarEventKind = 'no_classes' | 'early_end' | 'fast' | 'community' | 'exam';

export interface CalendarEvent {
  id: string;
  title: string;
  start: ISODate;
  end?: ISODate; // inclusive
  kind: CalendarEventKind;
  note?: string;
}

export interface Settings {
  id: 'app';
  seedVersion: number;
  onboarded: boolean;
  gender: Gender;
  displayName: string;
  activeSemesterId: string;
  showCommunityHolidays: boolean;
  autoPlanDaysBefore: number;
  pomodoro: { focus: number; shortBreak: number; longBreak: number };
  /** ISO timestamp of the last backup file made on this device. */
  lastBackupAt?: string;
}
