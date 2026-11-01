import { beforeEach, describe, expect, it } from 'vitest';
import { AppDB } from '../db';
import { ensureSeeded } from './index';

let db: AppDB;
beforeEach(() => {
  db = new AppDB(`test-${crypto.randomUUID()}`);
});

describe('seed', () => {
  it('creates semesters, the 9 semester A courses, calendar and settings', async () => {
    await ensureSeeded(db);
    expect(await db.semesters.count()).toBe(2);
    expect(await db.courses.where('semesterId').equals('sem-5787-a').count()).toBe(9);
    expect(await db.courses.filter((c) => c.department === 'psych').count()).toBe(4);
    expect((await db.settings.get('app'))?.activeSemesterId).toBe('sem-5787-a');
    expect(await db.calendarEvents.count()).toBeGreaterThan(10);
  });

  it('is idempotent, even when called twice at once', async () => {
    await Promise.all([ensureSeeded(db), ensureSeeded(db)]);
    await ensureSeeded(db);
    expect(await db.courses.count()).toBe(9);
  });

  it('does not overwrite user changes on the next start', async () => {
    await ensureSeeded(db);
    await db.settings.update('app', { gender: 'f', onboarded: true });
    await ensureSeeded(db);
    expect((await db.settings.get('app'))?.gender).toBe('f');
  });

  it('adds readings, topics, lecturers and links to the matching courses', async () => {
    await ensureSeeded(db);
    const byName = async (name: string) => (await db.courses.filter((c) => c.name === name).first())!;
    const physio = await byName('יסודות פיזיולוגיים של ההתנהגות א׳');
    expect(physio.lecturer).toBe('ד״ר נעמי פיין');
    expect(physio.credits).toBe(2);
    expect(await db.readings.where('courseId').equals(physio.id).count()).toBe(6);
    expect(await db.topics.where('courseId').equals(physio.id).count()).toBe(13);
    const dev = await byName('פסיכולוגיה התפתחותית א׳');
    expect(await db.readings.where('courseId').equals(dev.id).filter((r) => r.kind === 'article').count()).toBe(4);
    expect(await db.links.filter((l) => !l.courseId).count()).toBeGreaterThan(0);
  });

  it('leaves out business-administration material', async () => {
    await ensureSeeded(db);
    const all = [...(await db.links.toArray()).map((l) => l.title), ...(await db.readings.toArray()).map((r) => r.title)];
    expect(all.some((x) => /שיווק|ארגונית|למנהלים|מנע/.test(x))).toBe(false);
  });

  it('upgrades a device seeded with step 1 without duplicating data', async () => {
    await ensureSeeded(db);
    await db.readings.clear();
    await db.topics.clear();
    await db.links.clear();
    await db.settings.update('app', { seedVersion: 1, onboarded: true });
    await ensureSeeded(db);
    await ensureSeeded(db);
    expect(await db.courses.count()).toBe(9);
    expect(await db.readings.count()).toBe(61);
    expect((await db.settings.get('app'))?.onboarded).toBe(true);
  });

  it('keeps reading status and a user link when content is refreshed', async () => {
    await ensureSeeded(db);
    const intro = (await db.courses.filter((c) => c.name === 'מבוא לפסיכולוגיה').first())!;
    const ch5 = (await db.readings.where('courseId').equals(intro.id).filter((r) => r.chaptersOrPages.startsWith('פרק 5')).first())!;
    await db.readings.update(ch5.id, { status: 'read', url: 'https://example.com/ch5' });
    await db.settings.update('app', { seedVersion: 2 });
    await ensureSeeded(db);
    const after = (await db.readings.where('courseId').equals(intro.id).filter((r) => r.chaptersOrPages.startsWith('פרק 5')).toArray());
    expect(after).toHaveLength(1);
    expect(after[0].status).toBe('read');
    expect(after[0].url).toBe('https://example.com/ch5');
  });

  it('labels every reading with a requirement level', async () => {
    await ensureSeeded(db);
    const levels = new Set((await db.readings.toArray()).map((r) => r.requirement));
    expect([...levels].sort()).toEqual(['optional', 'recommended', 'required', 'unverified']);
  });

  it('does not duplicate summary links when they are refreshed', async () => {
    await ensureSeeded(db);
    const count = await db.links.count();
    await db.settings.update('app', { seedVersion: 4 });
    await ensureSeeded(db);
    expect(await db.links.count()).toBe(count);
    expect(await db.links.filter((l) => l.title === 'סיכומי מאמרים').count()).toBe(0);
  });
});
