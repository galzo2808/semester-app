import { describe, expect, it } from 'vitest';
import { CALENDAR_5787 } from '../data/seed/calendar5787';
import { lessonsOn } from './schedule';
import type { Lesson, LessonChange, Semester } from './types';

const stamp = { createdAt: '', updatedAt: '' };
const semA: Semester = {
  id: 'a', name: 'א', yearLabel: 'תשפ״ז', term: 'a', startDate: '2026-10-18', endDate: '2027-01-17',
  studyDays: [0, 2, 3, 4], archived: false, ...stamp,
};
const lesson = (id: string, weekday: number, startTime: string): Lesson => ({
  id, courseId: `c-${id}`, kind: 'lecture', weekday, startTime, endTime: '23:00', location: '', ...stamp,
});
const lessons = [lesson('acc', 2, '14:00'), lesson('stat', 2, '11:00'), lesson('econ', 0, '08:15')];
const changes: LessonChange[] = [
  { id: 'x1', date: '2026-11-03', courseId: 'c-acc', kind: 'cancelled', lessonId: 'acc', ...stamp },
  { id: 'x2', date: '2026-11-09', courseId: 'c-stat', kind: 'extra', startTime: '10:30', endTime: '12:00', location: 'זום', ...stamp },
];

describe('schedule', () => {
  it('lists the weekday lessons in time order, marking cancellations', () => {
    const day = lessonsOn('2026-11-03', semA, lessons, changes, CALENDAR_5787);
    expect(day.map((l) => [l.key, l.cancelled])).toEqual([['stat', false], ['acc', true]]);
  });

  it('adds one-off extra lessons on days without regular classes', () => {
    const day = lessonsOn('2026-11-09', semA, lessons, changes, CALENDAR_5787);
    expect(day).toHaveLength(1);
    expect(day[0]).toMatchObject({ key: 'x2', extra: true, location: 'זום' });
  });

  it('has nothing on holidays or outside the semester', () => {
    expect(lessonsOn('2026-12-06', semA, lessons, changes, CALENDAR_5787)).toEqual([]); // Hanukkah, Sunday
    expect(lessonsOn('2027-01-24', semA, lessons, changes, CALENDAR_5787)).toEqual([]);
  });
});
