import { describe, expect, it } from 'vitest';
import { nextReadingStatus, readingCoversWeek, readingsForWeek } from './reading';
import type { ReadingItem } from './types';

const item = (p: Partial<ReadingItem>): ReadingItem => ({
  id: 'x', courseId: 'c', kind: 'book', title: 't', author: '', requirement: 'required', chaptersOrPages: '',
  status: 'not_started', summaryFileIds: [], createdAt: '', updatedAt: '', ...p,
});

describe('reading', () => {
  it('cycles status forward and wraps', () => {
    expect(nextReadingStatus('not_started')).toBe('reading');
    expect(nextReadingStatus('summarized')).toBe('not_started');
  });

  it('covers a range of weeks', () => {
    const r = item({ syllabusWeek: 3, syllabusWeekEnd: 8 });
    expect(readingCoversWeek(r, 3)).toBe(true);
    expect(readingCoversWeek(r, 8)).toBe(true);
    expect(readingCoversWeek(r, 9)).toBe(false);
    expect(readingCoversWeek(item({}), 3)).toBe(false);
  });

  it('lists open items for the week by priority, leaving out optional ones', () => {
    const list = readingsForWeek(
      [
        item({ id: 'rec', requirement: 'recommended', syllabusWeek: 3 }),
        item({ id: 'opt', requirement: 'optional', syllabusWeek: 3 }),
        item({ id: 'unv', requirement: 'unverified', syllabusWeek: 2, syllabusWeekEnd: 4 }),
        item({ id: 'req', syllabusWeek: 3 }),
        item({ id: 'done', syllabusWeek: 3, status: 'read' }),
        item({ id: 'other', syllabusWeek: 4 }),
      ],
      3,
    );
    expect(list.map((r) => r.id)).toEqual(['req', 'unv', 'rec']);
  });
});
