import { describe, expect, it } from 'vitest';
import { CALENDAR_5787 } from '../data/seed/calendar5787';
import { isStudyDay, semesterStatus, semesterWeek } from './semester';
import type { Semester } from './types';

const semA: Semester = {
  id: 'a', name: 'א', yearLabel: 'תשפ״ז', term: 'a',
  startDate: '2026-10-18', endDate: '2027-01-17', examsStartDate: '2027-01-18',
  studyDays: [0, 2, 3, 4], archived: false, createdAt: '', updatedAt: '',
};

describe('semester', () => {
  it('numbers syllabus weeks from the opening week', () => {
    expect(semesterWeek(semA, '2026-10-18')).toBe(1);
    expect(semesterWeek(semA, '2026-10-31')).toBe(2);
    expect(semesterWeek(semA, '2026-11-01')).toBe(3);
    expect(semesterWeek(semA, '2027-01-17')).toBe(14);
    expect(semesterWeek(semA, '2026-10-17')).toBeNull();
    expect(semesterWeek(semA, '2027-01-18')).toBeNull();
  });

  it('reports status around the semester', () => {
    expect(semesterStatus(semA, '2026-10-01')).toBe('before');
    expect(semesterStatus(semA, '2026-12-01')).toBe('active');
    expect(semesterStatus(semA, '2027-01-18')).toBe('exams');
  });

  it('knows study days, skipping holidays', () => {
    expect(isStudyDay(semA, '2026-11-01', CALENDAR_5787)).toBe(true); // Sunday
    expect(isStudyDay(semA, '2026-11-02', CALENDAR_5787)).toBe(false); // Monday
    expect(isStudyDay(semA, '2026-11-03', CALENDAR_5787)).toBe(true); // Tuesday
    expect(isStudyDay(semA, '2026-12-06', CALENDAR_5787)).toBe(false); // Hanukkah, Sunday
  });
});
