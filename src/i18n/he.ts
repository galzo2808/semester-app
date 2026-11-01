// Every UI string lives here. A string that depends on the user's grammatical
// gender is written as { m, f }; `t()` picks the right form.
// Placeholders: {name} is replaced from the `vars` argument.
import type { Gender } from '../domain/types';

type Entry = string | { m: string; f: string };

export const he = {
  'app.name': 'הסמסטר שלי',

  'nav.today': 'היום',
  'nav.week': 'שבוע',
  'nav.courses': 'קורסים',
  'nav.exams': 'מבחנים',
  'nav.more': 'עוד',

  'gender.m': 'לשון זכר',
  'gender.f': 'לשון נקבה',

  'onboarding.title': 'ברוכים הבאים',
  'onboarding.subtitle': 'משימות, לוח שבועי, קריאה ומבחנים. הכל במקום אחד.',
  'onboarding.genderQuestion': 'איך לפנות אליך?',
  'onboarding.nameLabel': 'שם פרטי (לא חובה)',
  'onboarding.start': { m: 'בוא נתחיל', f: 'בואי נתחיל' },
  'onboarding.privacy': 'הנתונים נשמרים רק במכשיר הזה. לא צריך להירשם.',

  'time.today': 'היום',
  'time.tomorrow': 'מחר',
  'time.twoDays': 'בעוד יומיים',
  'time.inDays': 'בעוד {n} ימים',

  'today.hello': 'שלום',
  'today.helloName': 'שלום, {name}',
  'today.question': { m: 'מוכן ליום?', f: 'מוכנה ליום?' },
  'today.semesterWeek': 'שבוע {week} · {semester}',
  'today.beforeSemester': '{semester} מתחיל {when}',
  'today.betweenSemesters': 'הסמסטר הסתיים',
  'today.noClasses': 'אין לימודים היום: {title}',
  'today.saturday': 'שבת. זמן טוב לנוח.',
  'today.freeDay': 'אין שיעורים היום. זמן טוב ללמידה עצמית.',
  'today.lessonsTitle': 'השיעורים של היום',
  'today.lessonsEmpty': 'אין שיעורים היום.',
  'lesson.kind.lecture': 'הרצאה',
  'lesson.kind.practice': 'תרגול',
  'lesson.kind.lab': 'מעבדה',
  'lesson.cancelled': 'מבוטל',
  'lesson.extra': 'שיעור נוסף',
  'lesson.markCancelled': 'סימון ביטול',
  'lesson.restore': 'ביטול הסימון',
  'lesson.removeExtra': 'הסרה',
  'course.schedule': 'מערכת שעות',
  'today.goToCourses': 'לקורסים',
  'today.weekReadingTitle': 'קריאה לשבוע {week}',
  'today.weekReadingEmpty': 'אין קריאה פתוחה לשבוע הזה.',
  'today.upcomingTitle': 'מה מתקרב',
  'today.upcomingEmpty': 'אין אירועים מיוחדים בשבועות הקרובים.',

  'exams.title': 'מבחנים',
  'exams.period': 'תקופת הבחינות',
  'exams.periodCountdown': 'מתחילה {when}',
  'exams.periodStarted': 'התחילה ב־{date}',
  'exams.periodUnknown': 'עוד לא נקבע מועד.',
  'exams.daysLeft': 'ימים',
  'exams.empty': 'עוד לא הוזנו מבחנים.',
  'exams.moedA': 'מועד א׳',
  'exams.moedB': 'מועד ב׳',
  'exams.next': 'המבחן הבא: {course}',
  'exams.when': '{date} · {when}',
  'exams.timeTbd': 'השעה והכיתה יעודכנו כשיפורסמו.',
  'exams.other': 'מבחנים נוספים',
  'exams.past': 'עבר',

  'week.title': 'שבוע {week}',
  'week.titleOutside': 'שבוע',
  'week.range': '{from} עד {to}',
  'week.prev': 'השבוע הקודם',
  'week.next': 'השבוע הבא',
  'week.backToToday': 'השבוע',
  'week.studyDay': 'יום לימודים',
  'week.today': 'היום',
  'week.lessonsEmpty': 'אין שיעורים',

  'courses.title': 'קורסים',
  'courses.empty': 'אין קורסים בסמסטר הזה.',
  'courses.count': '{n} קורסים',
  'dept.econ': 'כלכלה',
  'dept.psych': 'פסיכולוגיה',

  'course.back': 'כל הקורסים',
  'course.notFound': 'הקורס לא נמצא.',
  'course.tab.tasks': 'משימות',
  'course.tab.reading': 'קריאה',
  'course.tab.topics': 'נושאים',
  'course.tab.flashcards': 'כרטיסיות',
  'course.tab.materials': 'חומרים',
  'course.tabEmpty': 'עוד אין כאן פריטים.',
  'course.lecturer': 'מרצה: {name}',
  'course.credits': '{n} נ״ז',

  'reading.books': 'ספרים',
  'reading.articles': 'מאמרים',
  'reading.media': 'פודקאסטים והעשרה',
  'reading.req.required': 'חובה',
  'reading.req.optional': 'רשות',
  'reading.req.recommended': 'מומלץ',
  'reading.req.unverified': 'לא מאומת',
  'reading.week': 'שבוע {week}',
  'reading.weeks': 'שבועות {from} עד {to}',
  'reading.status.not_started': 'לא התחלתי',
  'reading.status.reading': 'בקריאה',
  'reading.status.read': 'נקרא',
  'reading.status.summarized': 'יש סיכום',
  'reading.statusHint': 'לחיצה משנה סטטוס',
  'reading.open': 'פתיחה',
  'reading.addLink': 'הוספת קישור',
  'reading.editLink': 'שינוי קישור',
  'reading.linkLabel': 'קישור לספר או למאמר',
  'reading.linkPlaceholder': 'הדבקת קישור',
  'reading.linkInvalid': 'זה לא נראה כמו קישור. אפשר להדביק כתובת שמתחילה ב־https.',
  'reading.linkSave': 'שמירה',
  'reading.linkCancel': 'ביטול',
  'reading.linkRemove': 'הסרת הקישור',
  'reading.searchScholar': 'חיפוש ב־Google Scholar',
  'reading.empty': 'עוד אין פריטי קריאה בקורס הזה.',

  'topics.empty': 'עוד אין נושאים בקורס הזה.',

  'materials.disclaimer': 'סיכומים של סטודנטים משנים קודמות. ייתכנו הבדלים מהחומר של השנה.',
  'materials.empty': 'עוד אין חומרים לקורס הזה.',
  'materials.cat.exam': 'לקראת המבחן',
  'materials.cat.reading': 'סיכומי קריאה',
  'materials.cat.lectures': 'סיכומי שיעורים',
  'materials.cat.practice': 'תרגול ומבחנים',
  'materials.cat.folder': 'תיקיות סיכומים',
  'materials.cat.general': 'מידע כללי',

  'update.available': 'יש גרסה חדשה של האפליקציה.',
  'update.apply': 'עדכון',
  'update.later': 'אחר כך',

  'backup.title': 'גיבוי ושחזור',
  'backup.explain': 'הנתונים שמורים רק במכשיר הזה. קובץ גיבוי שומר אותם גם אם הטלפון מתחלף או שהדפדפן מתנקה.',
  'backup.never': 'עוד לא נעשה גיבוי.',
  'backup.lastToday': 'הגיבוי האחרון: היום.',
  'backup.lastDaysAgo': 'הגיבוי האחרון: לפני {n} ימים.',
  'backup.create': 'יצירת קובץ גיבוי',
  'backup.restore': 'שחזור מקובץ גיבוי',
  'backup.saved': 'הגיבוי נשמר.',
  'backup.saveFailed': 'הגיבוי לא נשמר. אפשר לנסות שוב.',
  'backup.confirmRestore': 'לשחזר מהגיבוי מתאריך {date}? כל הנתונים שבמכשיר עכשיו יוחלפו בנתוני הגיבוי.',
  'backup.restored': 'השחזור הושלם.',
  'backup.error.not_json': 'זה לא קובץ גיבוי של האפליקציה.',
  'backup.error.wrong_format': 'זה לא קובץ גיבוי של האפליקציה.',
  'backup.error.newer_version': 'הגיבוי נוצר בגרסה חדשה יותר. כדאי לעדכן את האפליקציה ולנסות שוב.',
  'backup.error.broken': 'קובץ הגיבוי פגום, והנתונים לא שונו.',
  'backup.reminder': 'כדאי לגבות את הנתונים',
  'backup.reminderGo': 'לגיבוי',

  'more.title': 'עוד',
  'more.profile': 'פרופיל',
  'more.gender': 'לשון פנייה',
  'more.name': 'שם פרטי',
  'more.semester': 'סמסטר',
  'more.activeSemester': 'הסמסטר הנוכחי',
  'more.semesterDates': '{start} עד {end}',
  'more.studyDays': 'ימי לימוד',
  'more.calendar': 'לוח שנה',
  'more.communityHolidays': 'להציג חגי עדות',
  'more.officialCalendar': 'לוח השנה הרשמי של רופין',
  'more.links': 'קישורים שימושיים',
  'more.storage': 'אחסון',
  'more.storageUsage': '{used} בשימוש מתוך {quota} פנויים לאפליקציה',
  'more.storageUnknown': 'הדפדפן הזה לא מאפשר לבדוק נפח.',
  'more.persisted': 'הנתונים מוגנים ממחיקה אוטומטית.',
  'more.notPersisted': 'הדפדפן עלול למחוק נתונים אם ייגמר המקום. כדאי להתקין את האפליקציה למסך הבית.',
  'more.about': 'אודות',
  'more.version': 'גרסה {version}',
  'more.feedback': 'הצעה לשיפור',
  'more.disclaimer': 'אפליקציה עצמאית של סטודנטים. היא אינה רשמית ואינה קשורה למרכז האקדמי רופין.',

  'units.kb': '{n} ק״ב',
  'units.mb': '{n} מ״ב',
  'units.gb': '{n} ג״ב',

  'weekday.0': 'ראשון',
  'weekday.1': 'שני',
  'weekday.2': 'שלישי',
  'weekday.3': 'רביעי',
  'weekday.4': 'חמישי',
  'weekday.5': 'שישי',
  'weekday.6': 'שבת',
  'weekdayShort.0': 'א׳',
  'weekdayShort.1': 'ב׳',
  'weekdayShort.2': 'ג׳',
  'weekdayShort.3': 'ד׳',
  'weekdayShort.4': 'ה׳',
  'weekdayShort.5': 'ו׳',
  'weekdayShort.6': 'ש׳',
} satisfies Record<string, Entry>;

export type StringKey = keyof typeof he;
export type Vars = Record<string, string | number>;

export function t(key: StringKey, gender: Gender, vars?: Vars): string {
  const entry: Entry = he[key];
  const text = typeof entry === 'string' ? entry : entry[gender];
  return vars ? text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`)) : text;
}

/** "היום" / "מחר" / "בעוד יומיים" / "בעוד 5 ימים" */
export function inDays(days: number, gender: Gender): string {
  if (days <= 0) return t('time.today', gender);
  if (days === 1) return t('time.tomorrow', gender);
  if (days === 2) return t('time.twoDays', gender);
  return t('time.inDays', gender, { n: days });
}

export function formatBytes(bytes: number, gender: Gender): string {
  if (bytes < 1024 ** 2) return t('units.kb', gender, { n: Math.round(bytes / 1024) });
  if (bytes < 1024 ** 3) return t('units.mb', gender, { n: (bytes / 1024 ** 2).toFixed(1) });
  return t('units.gb', gender, { n: (bytes / 1024 ** 3).toFixed(1) });
}
