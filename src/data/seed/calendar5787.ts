// Ruppin academic calendar, תשפ״ז (2026–2027). Source: docs/calendar-5787.md.
// The official calendar is "subject to change", so every date is editable in the app.
import type { CalendarEvent } from '../../domain/types';

export const OFFICIAL_CALENDAR_URL =
  'https://www.ruppin.ac.il/media/0dqhnftn/%D7%9C%D7%95%D7%97-%D7%A9%D7%A0%D7%94-%D7%90%D7%A7%D7%93%D7%9E%D7%99-%D7%9E%D7%A2%D7%95%D7%93%D7%9B%D7%9F-181026.pdf';

export const CALENDAR_5787: CalendarEvent[] = [
  // Days without classes / early dismissal
  { id: 'cal-5787-hanukkah', kind: 'no_classes', title: 'חופשת חנוכה', start: '2026-12-06' },
  { id: 'cal-5787-esther', kind: 'early_end', title: 'תענית אסתר', start: '2027-03-22', note: 'סיום לימודים ובחינות ב־18:00' },
  { id: 'cal-5787-purim', kind: 'no_classes', title: 'חופשת פורים', start: '2027-03-23' },
  { id: 'cal-5787-pesach', kind: 'no_classes', title: 'חופשת פסח', start: '2027-04-21', end: '2027-04-28' },
  { id: 'cal-5787-shoah-eve', kind: 'early_end', title: 'ערב יום השואה', start: '2027-05-03', note: 'סיום לימודים ב־18:00' },
  { id: 'cal-5787-zikaron-eve', kind: 'early_end', title: 'ערב יום הזיכרון', start: '2027-05-10', note: 'סיום לימודים ב־16:00' },
  { id: 'cal-5787-atzmaut', kind: 'no_classes', title: 'יום הזיכרון ויום העצמאות', start: '2027-05-11', end: '2027-05-12' },
  { id: 'cal-5787-shavuot', kind: 'no_classes', title: 'חופשת שבועות', start: '2027-06-10', end: '2027-06-11' },
  // Fast days: an exam starting from 13:00 entitles to a special date
  { id: 'cal-5787-fast-tevet', kind: 'fast', title: 'צום י׳ בטבת', start: '2026-12-20', note: 'מבחן שמתחיל מ־13:00 מזכה במועד מיוחד' },
  { id: 'cal-5787-fast-tammuz', kind: 'fast', title: 'צום י״ז בתמוז', start: '2027-07-22', note: 'מבחן שמתחיל מ־13:00 מזכה במועד מיוחד' },
  { id: 'cal-5787-fast-gedalia', kind: 'fast', title: 'צום גדליה', start: '2027-10-04', note: 'מבחן שמתחיל מ־13:00 מזכה במועד מיוחד' },
  // Community holidays (shown only when enabled in settings)
  { id: 'cal-5787-sigd', kind: 'community', title: 'חג הסיגד', start: '2026-11-09' },
  { id: 'cal-5787-xmas', kind: 'community', title: 'חג המולד', start: '2026-12-24', end: '2026-12-25' },
  { id: 'cal-5787-xmas-orth', kind: 'community', title: 'חג המולד (אורתודוקסים)', start: '2027-01-06', end: '2027-01-07' },
  { id: 'cal-5787-eliyahu', kind: 'community', title: 'חג הנביא אליהו', start: '2027-01-25' },
  { id: 'cal-5787-ramadan', kind: 'community', title: 'תחילת הרמדאן', start: '2027-02-08' },
  { id: 'cal-5787-fitr', kind: 'community', title: 'עיד אל־פיטר', start: '2027-03-09', end: '2027-03-11' },
  { id: 'cal-5787-easter', kind: 'community', title: 'פסחא', start: '2027-03-28' },
  { id: 'cal-5787-shuayb', kind: 'community', title: 'חג הנביא שועייב', start: '2027-04-24', end: '2027-04-27' },
  { id: 'cal-5787-easter-orth', kind: 'community', title: 'פסחא (אורתודוקסים)', start: '2027-05-02' },
  { id: 'cal-5787-adha', kind: 'community', title: 'עיד אל־אדחא', start: '2027-05-16', end: '2027-05-20' },
];
