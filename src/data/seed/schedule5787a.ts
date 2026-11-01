// Semester A (תשפ״ז) timetable and exam dates, as sent by the user on 1.11.2026 (from the Ruppin calendar).
// Exam times and rooms were not published yet.
// Course names must match the seeded course names.
import type { CalendarEvent, Lesson } from '../../domain/types';

type Row = [weekday: number, start: string, end: string, course: string, kind: Lesson['kind'], location: string];

export const SCHEDULE_5787A: Row[] = [
  [0, '08:15', '09:45', 'מבוא לכלכלה א׳', 'practice', 'בניין 20, כיתה 102'],
  [0, '10:00', '11:30', 'סטטיסטיקה א׳', 'practice', 'בניין 20, כיתה 102'],
  [0, '12:00', '13:30', 'מתמטיקה א׳', 'practice', 'בניין 20, כיתה 102'],
  [0, '13:45', '16:15', 'יישומי מחשב', 'lab', 'בניין 23, מעבדה C'],
  [2, '08:45', '10:15', 'יסודות החשבונאות לכלכלנים', 'lecture', 'בניין 20, כיתה 105'],
  [2, '11:00', '12:30', 'סטטיסטיקה א׳', 'lecture', 'בניין 20, כיתה 201'],
  [2, '14:00', '15:30', 'יסודות החשבונאות לכלכלנים', 'practice', 'בניין 20, כיתה 201'],
  [3, '08:00', '09:30', 'פסיכולוגיה חברתית א׳', 'lecture', 'בניין 20, כיתה 101'],
  [3, '09:45', '11:15', 'פסיכולוגיה התפתחותית א׳', 'lecture', 'בניין 20, כיתה 101'],
  [3, '11:30', '13:00', 'מבוא לפסיכולוגיה', 'lecture', 'בניין 20, כיתה 101'],
  [3, '13:30', '15:00', 'יסודות פיזיולוגיים של ההתנהגות א׳', 'lecture', 'בניין 20, כיתה 105'],
  [3, '15:15', '16:45', 'מבוא לפסיכולוגיה', 'practice', 'בניין 30, כיתה 7'], // "תרגיל בפסיכולוגיה"
  [4, '08:00', '10:30', 'מבוא לכלכלה א׳', 'lecture', 'בניין 22, כיתה 1'],
  [4, '11:15', '12:45', 'מתמטיקה א׳', 'lecture', 'בניין 22, כיתה 1'],
];

/** One-off changes. A cancellation names the regular lesson by course, weekday and start time. */
export const SCHEDULE_CHANGES_5787A = [
  { date: '2026-11-03', kind: 'cancelled', course: 'יסודות החשבונאות לכלכלנים', start: '14:00' },
  {
    date: '2026-11-09',
    kind: 'extra',
    course: 'סטטיסטיקה א׳',
    start: '10:30',
    end: '12:00',
    location: 'זום',
    note: 'השלמה במקום השיעור מיום הבחירות. הקישור יישלח מהמרצה.',
  },
] as const;

/** [course, moed A, moed B] */
export const EXAMS_5787A: [string, string, string][] = [
  ['סטטיסטיקה א׳', '2027-01-21', '2027-03-03'],
  ['מבוא לפסיכולוגיה', '2027-01-28', '2027-03-07'],
  ['יישומי מחשב', '2027-02-01', '2027-03-10'],
  ['פסיכולוגיה חברתית א׳', '2027-02-04', '2027-03-14'],
  ['מבוא לכלכלה א׳', '2027-02-09', '2027-03-17'],
  ['פסיכולוגיה התפתחותית א׳', '2027-02-14', '2027-03-21'],
  ['מתמטיקה א׳', '2027-02-17', '2027-03-31'],
  ['יסודות החשבונאות לכלכלנים', '2027-02-22', '2027-04-07'],
  ['יסודות פיזיולוגיים של ההתנהגות א׳', '2027-02-25', '2027-03-28'],
];

/** Exams that are not tied to one of the semester's courses. */
export const EXTRA_EXAM_EVENTS_5787A: CalendarEvent[] = [
  { id: 'cal-5787-harassment-exam', kind: 'exam', title: 'מבחן הקורס המקוון למניעת הטרדה מינית', start: '2027-01-30', note: 'מועד א׳ בלבד' },
];
