// Semester A (תשפ״ז) course content. Sources, newest first:
//  - reading list checked in Moodle and the syllabi on 1.11.2026 (52 items): readings,
//    requirement level, weekly topics, lecturers, credits. Library lists (Leganto) were down,
//    so scanned articles listed only there may be missing.
//  - shared Drive summaries by אירית וולוך (2022–23) and older summaries (2017–18): links only.
// Business-administration (מנע״ס) material is deliberately left out.
// Courses are matched by name; see docs/syllabus-5787a.md for the full source mapping.
import type { LinkCategory, ReadingItem } from '../../domain/types';

type Reading = Pick<ReadingItem, 'kind' | 'title' | 'author' | 'requirement' | 'chaptersOrPages'> &
  Partial<Pick<ReadingItem, 'syllabusWeek' | 'syllabusWeekEnd' | 'notes' | 'url'>>;
type Link = { title: string; url: string; category: LinkCategory; source: string; note?: string };

export interface CourseContent {
  lecturer?: string;
  credits?: number;
  /** Shown under the course title: caveats about the syllabus, exam scope. */
  notes?: string;
  readings?: Reading[];
  /** [week, topic] */
  topics?: [number, string][];
  links?: Link[];
}

const IRIT = 'אירית וולוך, 2022–23';
// Relevance of each summary to this semester, checked on 1.11.2026 against the readings and topics.
const MATCH = 'מתאים לחומר של השנה.';
const PARTIAL = 'חפיפה חלקית: אותם נושאים, בלי המאמרים של השנה.';
const OLD = 'סיכומי מחזור 2017–18';
const doc = (id: string) => `https://docs.google.com/document/d/${id}/edit`;
const folder = (id: string) => `https://drive.google.com/drive/folders/${id}`;
const file = (id: string) => `https://drive.google.com/file/d/${id}/view`;

const PSY2E = { kind: 'book', title: 'Psychology 2e', author: 'Spielman, Jenkins & Lovett (2020)' } as const;
const DEV = { kind: 'book', title: 'פסיכולוגיה התפתחותית: ינקות, ילדות והתבגרות', author: 'ברק ומיירס (2021)' } as const;
const MYERS = { kind: 'book', title: 'פסיכולוגיה חברתית', author: 'מאיירס (2012)', requirement: 'unverified' } as const;
const CARLSON = { kind: 'book', title: 'הפיזיולוגיה של ההתנהגות (מהדורה 12 בעברית)', author: 'קרלסון', requirement: 'required' } as const;
const ORON = { kind: 'book', title: 'מבוא לכלכלה: מיקרו כלכלה', author: 'אורון, מארק ועופר', requirement: 'recommended' } as const;
const SYLLABUS_YEAR_NOTE = 'בכותרת הסילבוס כתוב תשפ״ו, אבל התאריכים והתוכן של תשפ״ז.';

export const SYLLABUS_5787A: Record<string, CourseContent> = {
  'מבוא לפסיכולוגיה': {
    lecturer: 'גב׳ מורן כנפו וד״ר מיטל פרידמן־אוסקר',
    credits: 3,
    notes: `${SYLLABUS_YEAR_NOTE} קוד הקורס בסילבוס (5001129) שונה מהנוכחי (5002127), ולכן ייתכן שזו גרסה לא מעודכנת.`,
    readings: [
      { ...PSY2E, requirement: 'optional', chaptersOrPages: 'פרק 1: מבוא ושורשים', syllabusWeek: 1 },
      { ...PSY2E, requirement: 'required', chaptersOrPages: 'פרק 2: שיטות מחקר', syllabusWeek: 2 },
      { ...PSY2E, requirement: 'required', chaptersOrPages: 'פרק 5: חישה ותפיסה', syllabusWeek: 4 },
      { ...PSY2E, requirement: 'required', chaptersOrPages: 'פרק 6: למידה', syllabusWeek: 5 },
      { ...PSY2E, requirement: 'required', chaptersOrPages: 'פרק 8: זיכרון', syllabusWeek: 6, syllabusWeekEnd: 7 },
      { ...PSY2E, requirement: 'required', chaptersOrPages: 'פרק 14', notes: 'מסומן חובה בסילבוס, אבל לא שובץ לשבוע מסוים.' },
      { ...PSY2E, requirement: 'required', chaptersOrPages: 'פרק 15: פסיכופתולוגיה', syllabusWeek: 10 },
      { ...PSY2E, requirement: 'optional', chaptersOrPages: 'פרק 16: טיפול', syllabusWeek: 11 },
      { kind: 'article', title: 'תרגולים 5 ו־7: מאמר אחד מתוך שלושה', author: '', requirement: 'required', chaptersOrPages: 'אסיף, שפירא ורומי (2016), מגמות · קידר ופרידמן (2011), שפה ומוח · סלומון, לב־שלם ודקל (2007), מגמות', syllabusWeek: 5, syllabusWeekEnd: 7, notes: 'לתרגול 5: כותרת ותקציר בלבד. לתרגול 7: כותרת, תקציר, מבוא ושיטה.' },
      { kind: 'article', title: 'עיצוב ההתנהגות בבית־ספר לילדים קשי חינוך: ניסוי בכלכלת אסימונים', author: 'גולדברג וטייכמן (1975)', requirement: 'required', chaptersOrPages: 'מגמות, כ״א, 334–340', syllabusWeek: 8, syllabusWeekEnd: 10, notes: 'לתרגולים 8 ו־10.' },
      { kind: 'article', title: 'תרגיל 3: מאמר אחד מתוך ארבעה', author: '', requirement: 'required', chaptersOrPages: 'Oh et al. (2018), Aging & Mental Health · Ashton et al. (2020), Learning & Memory · Schuster et al. (2018), J. Clinical Psychiatry · Lau et al. (2018), J. of Adolescence', notes: 'תרגיל 3 נכתב על המאמר שנבחר.' },
      { kind: 'article', title: 'תרגול 12: מאמר אחד מתוך ארבעה', author: '', requirement: 'required', chaptersOrPages: 'דוברומיפלין ועמיתיו (2019), גרונטולוגיה וגריאטריה · רוטפלד (2017), עיונים בחינוך · אבנון כלב (1998), סוגיות בחינוך מיוחד · רודניק ומילבואר (1998), בתנועה', syllabusWeek: 12 },
    ],
    topics: [
      [1, 'מבוא: שורשים וגישות'],
      [2, 'שיטות מחקר'],
      [3, 'יסודות ביולוגיים ואבולוציוניים'],
      [4, 'תפיסה'],
      [5, 'למידה'],
      [6, 'זיכרון'],
      [7, 'זיכרון'],
      [8, 'שכחה'],
      [9, 'לחץ'],
      [10, 'פסיכופתולוגיה (הרצאת אורח)'],
      [11, 'גישות טיפול'],
      [12, 'מולטי־דיסציפלינריות'],
      [13, 'הכנה למבחן'],
    ],
    links: [
      { title: 'סיכום למבחן', url: doc('117Oo4hxgo-CAWoThjeRHl8wD3hsiKUSUf4XWSOUcC4Y'), category: 'exam', source: IRIT, note: PARTIAL },
      { title: 'סיכום ספר הקריאה (אטקינסון)', url: doc('1T1I1PdmMFheik1KAi1zlSloW2mWPd8EnOWvy3djecYE'), category: 'reading', source: IRIT, note: 'חפיפה חלקית: ספר אחר מ־Psychology 2e, אבל אותם נושאים (תפיסה, למידה, זיכרון).' },
      { title: 'סיכומי שיעורים', url: doc('1VV5_ZAuBRG4CgVeKEBEANp1gI-RC1KeG3uMQ6CQ_Uq0'), category: 'lectures', source: IRIT, note: PARTIAL },
      { title: 'תיקיית סיכומים: מבוא לפסיכולוגיה', url: folder('1yfM8bMQWNiveVPlVovfZZW9IAq1HsmmT'), category: 'folder', source: OLD },
    ],
  },

  'פסיכולוגיה התפתחותית א׳': {
    lecturer: 'ד״ר צליל אינציגר',
    credits: 2,
    notes: `${SYLLABUS_YEAR_NOTE} קוד הקורס תואם. בתרגיל האמצע יינתן מאמר נוסף.`,
    readings: [
      { ...DEV, requirement: 'required', chaptersOrPages: 'פרק 1: עמ׳ 3–13, 34–40, 42–64', syllabusWeek: 1, syllabusWeekEnd: 3, url: 'https://lamda--openu-psik-io.eu1.proxy.openathens.net/pdfViewerGlance/6313', notes: 'הקישור דרך מערכת הספרייה (דורש התחברות).' },
      { ...DEV, requirement: 'required', chaptersOrPages: 'פרק 2: עמ׳ 92–111', syllabusWeek: 4, syllabusWeekEnd: 5 },
      { ...DEV, requirement: 'required', chaptersOrPages: 'פרק 5: עמ׳ 245–250, 251–274', syllabusWeek: 6, notes: 'שיעור א־סינכרוני.' },
      { ...DEV, requirement: 'required', chaptersOrPages: 'פרק 6: עמ׳ 279–297, 311–319', syllabusWeek: 7, syllabusWeekEnd: 8 },
      { ...DEV, requirement: 'required', chaptersOrPages: 'פרק 7: עמ׳ 341–381', syllabusWeek: 12, notes: 'שיעור א־סינכרוני.' },
      { kind: 'article', title: 'VI. Sensitive periods', author: 'Zeanah et al. (2011)', requirement: 'required', chaptersOrPages: 'Monographs of the SRCD, 76(4), 147–162', syllabusWeek: 9, notes: 'לשיעור 15.12: חסך אימהי.' },
      { kind: 'article', title: "Evidence for infants' internal working models of attachment", author: 'Johnson, Dweck & Chen (2007)', requirement: 'required', chaptersOrPages: 'Psychological Science, 18(6), 501–502', syllabusWeek: 10, notes: 'לשיעור 22.12: תאוריית ההתקשרות.' },
      { kind: 'article', title: 'Balancing the family and the collective', author: 'Aviezer, Sagi & Van Ijzendoorn (2002)', requirement: 'required', chaptersOrPages: 'Family Process, 41(3), 435–454', syllabusWeek: 11, notes: 'לשיעור 29.12: נוכחות חובה, צפייה בסרט ותרגיל.' },
      { kind: 'article', title: "Impact of parents' mobile device use on parent-child interaction", author: 'Kildare & Middlemiss (2017)', requirement: 'required', chaptersOrPages: 'Computers in Human Behavior, 75, 579–593', syllabusWeek: 13, notes: 'לשיעור 12.1.' },
    ],
    topics: [
      [1, 'מבוא: סוגיות מרכזיות בהתפתחות'],
      [3, 'מבוא: סוגיות מרכזיות בהתפתחות'],
      [4, 'ההקשרים הסביבתיים של ההתפתחות'],
      [5, 'ההקשרים הסביבתיים של ההתפתחות'],
      [6, 'חישה ותפיסה בינקות (א־סינכרוני)'],
      [7, 'התפתחות קוגניטיבית בינקות ובגיל הרך'],
      [8, 'התפתחות קוגניטיבית בינקות ובגיל הרך'],
      [9, 'חסך אימהי'],
      [10, 'תאוריית ההתקשרות'],
      [11, 'לינה משותפת בקיבוצים (נוכחות חובה)'],
      [12, 'מזג (א־סינכרוני)'],
      [13, 'הורים וילדים במסכים, וסיכום'],
    ],
    links: [
      { title: 'סיכום לקראת המבחן', url: doc('11PVFRbs5VOZABOlZjRA4yS1hIWCdPNqBHe0XaxOvEAE'), category: 'exam', source: IRIT, note: PARTIAL },
      { title: 'סיכום ספר הקריאה', url: doc('1G6LU9XoS2OQaf--mfuvO1Q9oXVyAdLHNYz3tP-VcWiY'), category: 'reading', source: IRIT, note: PARTIAL },
      { title: 'סיכומי שיעורים', url: doc('1eS9DkJCk9BoQJxPM5t8cclO-hbV1U_x52cds9ziOevY'), category: 'lectures', source: IRIT, note: PARTIAL },
      { title: 'תיקיית סיכומים: התפתחותית', url: folder('1Db2RpCubjxOrSQmY27HFWlr1ZOmQUxYF'), category: 'folder', source: OLD },
    ],
  },

  'פסיכולוגיה חברתית א׳': {
    lecturer: 'מר אליהו אדלר',
    credits: 2,
    notes: 'הבחינה תכלול גם חומר שלא נדון בהרצאות. ייתכנו שינויים בחלוקת הנושאים ובקריאה. הספר מופיע בסילבוס כ"ספר הקורס" בלי ציון חובה או רשות.',
    readings: [
      { ...MYERS, chaptersOrPages: 'כרך א׳: מבוא לפסיכולוגיה חברתית', syllabusWeek: 1, syllabusWeekEnd: 2 },
      { ...MYERS, chaptersOrPages: 'כרך א׳, פרק 2, עמ׳ 118–140', syllabusWeek: 3, syllabusWeekEnd: 4, notes: 'תפיסה חברתית.' },
      { ...MYERS, chaptersOrPages: 'כרך א׳, עמ׳ 91–119', syllabusWeek: 5, syllabusWeekEnd: 6, notes: 'תהליכי חשיבה ושיפוט חברתי.' },
      { ...MYERS, chaptersOrPages: 'כרך א׳, עמ׳ 39–89', syllabusWeek: 7, syllabusWeekEnd: 8, notes: 'תפיסת העצמי.' },
      { ...MYERS, chaptersOrPages: 'כרך ב׳, פרק 9, עמ׳ 372–426', syllabusWeek: 9, syllabusWeekEnd: 10, notes: 'דעות קדומות ואפליה.' },
      { ...MYERS, chaptersOrPages: 'כרך א׳, פרק 4, עמ׳ 144–174; פרק 7, עמ׳ 268–314', syllabusWeek: 11, syllabusWeekEnd: 13, notes: 'עמדות, שינוי עמדות ושכנוע.' },
      { kind: 'article', title: 'Durably reducing conspiracy beliefs through dialogues with AI', author: 'Costello, Pennycook & Rand (2024)', requirement: 'required', chaptersOrPages: 'Science, 385(6714)', syllabusWeek: 11, syllabusWeekEnd: 13, notes: 'קובץ PDF בעמוד הקורס במודל.' },
      { kind: 'article', title: 'The headwinds/tailwinds asymmetry', author: 'Davidai & Gilovich (2016)', requirement: 'required', chaptersOrPages: 'JPSP, 111(6), 835–851', syllabusWeek: 5, syllabusWeekEnd: 6, notes: 'קובץ PDF בעמוד הקורס במודל.' },
    ],
    // The syllabus counts meetings (מפגשים); one meeting per week is assumed.
    topics: [
      [1, 'מבוא לפסיכולוגיה חברתית'],
      [2, 'מבוא לפסיכולוגיה חברתית'],
      [3, 'תפיסה חברתית'],
      [4, 'תפיסה חברתית'],
      [5, 'תהליכי חשיבה ושיפוט חברתי'],
      [6, 'תהליכי חשיבה ושיפוט חברתי'],
      [7, 'תפיסת העצמי'],
      [8, 'תפיסת העצמי'],
      [9, 'דעות קדומות ואפליה'],
      [10, 'דעות קדומות ואפליה'],
      [11, 'עמדות, שינוי עמדות ושכנוע'],
      [12, 'עמדות, שינוי עמדות ושכנוע'],
      [13, 'עמדות, שינוי עמדות ושכנוע'],
    ],
    links: [
      { title: 'סיכום ספר הקריאה (מאיירס)', url: doc('1KBYM2kUozJr04BQOgCuS7jNiRVwaFLeKyCbPpE6RKZ0'), category: 'reading', source: IRIT, note: 'מתאים: אותו ספר ואותם נושאים כמו השנה.' },
      { title: 'סיכום לקראת המבחן', url: doc('1YhnZy24w9njRYKLp76Xdc6pPjAU1B1FuhcEBr1eF_mQ'), category: 'exam', source: IRIT, note: PARTIAL },
      { title: 'סיכומי שיעורים', url: doc('1Ky9Pr_8tY0AQWbNVjnuZTo2ydZ19gBKgrpr5NREFpuo'), category: 'lectures', source: IRIT, note: PARTIAL },
      { title: 'תיקיית סיכומים: פסיכולוגיה חברתית', url: folder('1I7N6U11biF4iGuA23elOM5Qr1kUppN-9'), category: 'folder', source: OLD },
    ],
  },

  'יסודות פיזיולוגיים של ההתנהגות א׳': {
    lecturer: 'ד״ר נעמי פיין',
    credits: 2,
    notes: 'הגרסה המחייבת למבחן היא התרגום העברי של קרלסון. המבחן יכלול גם חומר מהספר שלא נלמד בשיעור. בעמוד הקורס במודל יש חומרי עזר לפרקים 1–2.',
    readings: [
      { ...CARLSON, chaptersOrPages: 'פרק 1: מבוא', syllabusWeek: 1, syllabusWeekEnd: 2 },
      { ...CARLSON, chaptersOrPages: 'פרק 2: תאי מערכת העצבים', syllabusWeek: 3, syllabusWeekEnd: 8, notes: 'מבנה ותפקוד, תקשורת בתוך הנוירון ובין נוירונים.' },
      { ...CARLSON, chaptersOrPages: 'פרק 3: מבנה מערכת העצבים', syllabusWeek: 9, syllabusWeekEnd: 10 },
      { ...CARLSON, chaptersOrPages: 'פרק 4: פסיכופרמקולוגיה', syllabusWeek: 11 },
      { ...CARLSON, chaptersOrPages: 'פרק 5: שיטות מחקר בחקר המוח', syllabusWeek: 12 },
      { kind: 'book', title: 'Physiology of Behavior, 12th ed.', author: 'Carlson & Birkett (2017)', requirement: 'optional', chaptersOrPages: 'פרקים 1–5', notes: 'המקור האנגלי. המרצה משתמשת בשתי הגרסאות.' },
    ],
    topics: [
      [1, 'מבוא'],
      [2, 'מבוא'],
      [3, 'תאי מערכת העצבים'],
      [4, 'תאי מערכת העצבים'],
      [5, 'התקשורת בתוך הנוירון'],
      [6, 'התקשורת בתוך הנוירון'],
      [7, 'התקשורת בין הנוירונים'],
      [8, 'התקשורת בין הנוירונים'],
      [9, 'מבנה מערכת העצבים'],
      [10, 'מערכת העצבים המרכזית'],
      [11, 'פסיכופרמקולוגיה'],
      [12, 'שיטות מחקר בחקר המוח'],
      [13, 'חזרה למבחן'],
    ],
    links: [
      { title: 'סיכום למבחן', url: doc('1RgLijyVEYoeMKMwP8jEs9mx0zNeQKPO8GJFyks9g-e0'), category: 'exam', source: IRIT, note: MATCH },
      { title: 'סיכום ספר הקריאה (קרלסון, פרקים 1–5)', url: doc('12ONGis3MbPvFIDa6-wQx0OPeZnr3-zZsQUHDjIgyPTw'), category: 'reading', source: IRIT, note: 'מתאים: אותו ספר ואותם פרקים כמו השנה.' },
      { title: 'סיכומי שיעורים', url: doc('1rvXmq-wkIiG7rCQt8yQS2KhkbYY7c4RBnUjqY4x2_eI'), category: 'lectures', source: IRIT, note: MATCH },
      { title: 'תיקיית סיכומים: פיזיולוגית', url: folder('1_f4yk5htB8hcccbDPzIiN4mT_6dpE65C'), category: 'folder', source: OLD },
    ],
  },

  'מבוא לכלכלה א׳': {
    lecturer: 'ד״ר אריה שרמן (מתרגל: שלומי כץ)',
    credits: 4,
    notes: 'כל הקריאה בקורס מומלצת, אין קריאת חובה.',
    readings: [
      { ...ORON, chaptersOrPages: 'פרקים 1, 4', syllabusWeek: 1, syllabusWeekEnd: 2 },
      { ...ORON, chaptersOrPages: 'פרק 3', syllabusWeek: 3 },
      { ...ORON, chaptersOrPages: 'פרק 5', syllabusWeek: 4 },
      { ...ORON, chaptersOrPages: 'פרק 8', syllabusWeek: 6 },
      { ...ORON, chaptersOrPages: 'פרק 9', syllabusWeek: 7 },
      { ...ORON, chaptersOrPages: 'פרק 10', syllabusWeek: 8, syllabusWeekEnd: 9 },
      { ...ORON, chaptersOrPages: 'פרק 15', syllabusWeek: 10 },
      { ...ORON, chaptersOrPages: 'פרק 11', syllabusWeek: 11 },
      { ...ORON, chaptersOrPages: 'פרק 17', syllabusWeek: 12 },
      { kind: 'book', title: 'יסודות הכלכלה', author: 'תומס סואל', requirement: 'recommended', chaptersOrPages: 'פרק ההקדמה', syllabusWeek: 1 },
      { kind: 'book', title: 'הפילוסופים הארציים', author: 'רוברט היילברונר', requirement: 'recommended', chaptersOrPages: 'פרקים א׳–ט׳', syllabusWeek: 1 },
      { kind: 'book', title: 'Principles of Economics, 2nd ed.', author: 'N. G. Mankiw', requirement: 'recommended', chaptersOrPages: '' },
      { kind: 'article', title: 'כלכלה: מדע, מקצוע או אידאולוגיה?', author: '', requirement: 'recommended', chaptersOrPages: '', notes: 'חומר העשרה בעמוד הקורס במודל.' },
      { kind: 'media', title: 'עושים חשבון', author: 'פרופ׳ עומר מואב ושות׳', requirement: 'recommended', chaptersOrPages: '', notes: 'פודקאסט.' },
      { kind: 'media', title: 'פודוקסיק: הרצאות ושיחות', author: '', requirement: 'recommended', chaptersOrPages: '', notes: 'פודקאסט: פילוסופיה, היסטוריה ואקטואליה.' },
    ],
    topics: [
      [1, 'מבוא: המהפכה הכלכלית, מחסור וויתור אלטרנטיבי'],
      [2, 'יתרון יחסי ומוחלט, גבול אפשרויות הייצור'],
      [3, 'מסחר בין שבטים ובינלאומי, צמיחה כלכלית'],
      [4, 'פונקציית הייצור בתנאי תפוקה שולית פוחתת'],
      [5, 'חזרה על מנגנון ההקצאה של שוק משוכלל'],
      [6, 'פונקציית עלויות, עקומת ההיצע ועודף היצרן'],
      [7, 'תורת הצרכן, עקומת הביקוש ועודף הצרכן'],
      [8, 'גמישות הביקוש והתחלת שיווי משקל'],
      [9, 'שיווי משקל בתנאי תחרות משוכללת'],
      [10, 'התערבות ממשלה: מסים, סובסידיות, מחיר מינימום ומקסימום'],
      [11, 'שיווי משקל במשק פתוח: יבוא ויצוא'],
      [12, 'מונופול'],
      [13, 'חזרה לבחינה'],
    ],
    links: [
      { title: 'מיקרו כלכלה: מבחנים קודמים, שאלות חזרה ותרגילים', url: folder('12fL-uMD7mms1T36ctd72cvaZC4Gh88Bk'), category: 'practice', source: OLD, note: 'כולל מבחנים בגרסת כלכלנים. ייתכנו הבדלים מהקורס השנה.' },
    ],
  },

  'יסודות החשבונאות לכלכלנים': {
    lecturer: 'רו״ח רונן קלינמן',
    readings: [
      { kind: 'book', title: 'תקני הדיווח הכספי הבינלאומיים (תרגום לעברית)', author: 'המוסד הישראלי לתקינה בחשבונאות (2019)', requirement: 'recommended', chaptersOrPages: '', url: 'https://www.iasb.org.il' },
      { kind: 'book', title: 'חשבונאות פיננסית חדש IFRS 2020', author: 'שוב ואוסטרובסקי', requirement: 'recommended', chaptersOrPages: '' },
      { kind: 'book', title: 'יסודות החשבונאות ודיווח כספי, כרך א׳', author: 'יוסי אהרוני (2010)', requirement: 'recommended', chaptersOrPages: 'יחידות 1–10', notes: 'האוניברסיטה הפתוחה, מהדורה שנייה.' },
    ],
  },

  'סטטיסטיקה א׳': {
    lecturer: 'ד״ר גלית אהרון וגב׳ סיביה סוסונוב',
    readings: [
      { kind: 'book', title: 'Statistics for Business and Economics, 15th ed.', author: 'Cochran, Camm, Anderson, Fry & Ohlmann (2023)', requirement: 'recommended', chaptersOrPages: '' },
      { kind: 'book', title: 'Introduction to Probability, 2nd ed.', author: 'Blitzstein & Hwang (2019)', requirement: 'recommended', chaptersOrPages: '' },
      { kind: 'book', title: 'הסתברות: מבוא להסתברות וסטטיסטיקה', author: 'לויתן ורביב (2007)', requirement: 'recommended', chaptersOrPages: '' },
      { kind: 'book', title: 'מבוא לסטטיסטיקה לתלמידי מדעי החברה א׳, כרך ראשון', author: 'זמיר ומרום־בייט (2010)', requirement: 'recommended', chaptersOrPages: 'סטטיסטיקה תיאורית, יחידות 1–5' },
      { kind: 'book', title: 'מבוא לסטטיסטיקה א׳, כרך שני', author: 'זמיר, מרום־בייט וברקן (2001)', requirement: 'recommended', chaptersOrPages: 'הסתברות, יחידות 6–8' },
    ],
    links: [
      { title: 'סיכומי הקורס, מושגים והסתברות', url: folder('1t5IwEGE66A8BdLWzLmhmS6rxjDBYNser'), category: 'folder', source: OLD },
      { title: 'SPSS: חוברת עזר וסיכום מצגת', url: folder('1yXJxTBfpUlUA0QTV3vXcyPCpehj9OHGy'), category: 'folder', source: OLD },
    ],
  },

  'מתמטיקה א׳': {
    lecturer: 'מר פליקס ברט',
    readings: [
      { kind: 'book', title: 'מתמטיקה א׳ לכלכלנים', author: 'יונתן סטופ', requirement: 'recommended', chaptersOrPages: '' },
      { kind: 'book', title: 'חשבון דיפרנציאלי לתלמידי כלכלה וניהול', author: 'האוניברסיטה הפתוחה', requirement: 'recommended', chaptersOrPages: '' },
      { kind: 'book', title: 'חשבון דיפרנציאלי ואינטגרלי', author: 'אשכנזי וארז', requirement: 'recommended', chaptersOrPages: '' },
    ],
    links: [
      { title: 'דפי נוסחאות ומבחנים לדוגמה', url: folder('1thnMY0JBIYfTtKRVsMvAtSMrvRsiLIX7'), category: 'practice', source: OLD },
    ],
  },

  'יישומי מחשב': {
    notes: 'אין סילבוס ורשימת קריאה בעמוד הקורס. כרגע יש שם רק מטלות ופתרונות.',
  },
};

/** Links not tied to a course (shown under "עוד"). */
export const GENERAL_LINKS_5787: Link[] = [
  { title: 'כל הסיכומים (תיקייה משותפת)', url: folder('17hZf4DbzB0fH8JNFOZwORUgX4gMys03q'), category: 'general', source: 'קרדיט: אירית וולוך ומחזורים קודמים', note: 'לשימוש אישי ולשיתוף עם חברים מהתואר. לא למכירה.' },
  { title: 'יומן קריאה (Google Sheets)', url: 'https://docs.google.com/spreadsheets/d/1hy2CDaU0r1lQU3Ah4WcQhj8eNlowG73160aEZnCsPik/edit', category: 'general', source: 'הדרייב שלך' },
  { title: 'שירותים לסטודנטים: נגישות, ייעוץ, שיעורי עזר, מלגות, ספרייה', url: file('14KMUL9RtQFyZsVU5ywqxbeJxw6sOO7Ir'), category: 'general', source: 'מידע שימושי' },
  { title: 'ללמוד איך ללמוד (מרכז נגישות)', url: file('1BvGeWzSR4NCIXqbLCaSZX_vDY4PPhrB7'), category: 'general', source: 'מידע שימושי' },
  { title: 'סיכום סדנת אסטרטגיות למידה', url: file('1QUGIPP4_oVpXwya0t3pCEeRxNO4EeR_K'), category: 'general', source: 'מידע שימושי' },
  { title: 'מפת הקמפוס', url: file('1ZYAls0Xwm6I9bMZVnftsVHIXro14bIHi'), category: 'general', source: 'מידע שימושי' },
  { title: 'אפליקציות לסטודנטים', url: file('1GEkPvmTa4Shl0T6iaA1C6bougRjczdE0'), category: 'general', source: 'מידע שימושי' },
];
