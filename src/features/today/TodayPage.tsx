import { Link } from 'react-router-dom';
import { useActiveSemester, useCalendarEvents, useSemesterReadings, useSettings, useTimetable } from '../../data/repos';
import { eventsOn, upcomingEvents } from '../../domain/calendar';
import { daysBetween, formatDate, formatShortDate, todayISO, weekday } from '../../domain/dates';
import { isBackupDue } from '../../domain/backup';
import { readingsForWeek } from '../../domain/reading';
import { lessonsOn } from '../../domain/schedule';
import { isStudyDay, semesterStatus, semesterWeek } from '../../domain/semester';
import { inDays, type StringKey } from '../../i18n/he';
import { useT } from '../../i18n/useT';
import { Card, Empty, PageHeader } from '../../ui/components';
import { ExamPeriodCard } from '../exams/ExamPeriodCard';
import { ReadingRow } from '../reading/ReadingTab';
import { LessonList } from '../schedule/LessonList';

const UPCOMING_WINDOW_DAYS = 45;

export function TodayPage() {
  const { t, gender } = useT();
  const settings = useSettings();
  const semester = useActiveSemester();
  const events = useCalendarEvents() ?? [];
  const readings = useSemesterReadings(semester?.id) ?? [];
  const timetable = useTimetable(semester?.id);
  const today = todayISO();
  const includeCommunity = settings?.showCommunityHolidays ?? false;

  const hello = settings?.displayName ? t('today.helloName', { name: settings.displayName }) : t('today.hello');
  const dateLine = `${t(`weekday.${weekday(today)}` as StringKey)}, ${formatDate(today)}`;

  let semesterLine = '';
  if (semester) {
    const status = semesterStatus(semester, today);
    const week = semesterWeek(semester, today);
    if (week !== null) semesterLine = t('today.semesterWeek', { week, semester: semester.name });
    else if (status === 'before')
      semesterLine = t('today.beforeSemester', {
        semester: semester.name,
        when: inDays(daysBetween(today, semester.startDate), gender),
      });
    else semesterLine = t('today.betweenSemesters');
  }

  const noClassesEvent = eventsOn(today, events).find((e) => e.kind === 'no_classes');
  let dayNote = '';
  if (noClassesEvent) dayNote = t('today.noClasses', { title: noClassesEvent.title });
  else if (weekday(today) === 6) dayNote = t('today.saturday');
  const week = semester ? semesterWeek(semester, today) : null;

  const weekReadings = week === null ? [] : readingsForWeek(readings, week);
  const todayLessons =
    semester && timetable ? lessonsOn(today, semester, timetable.lessons, timetable.changes, events) : [];
  if (!dayNote && week !== null && todayLessons.length === 0 && semester && !isStudyDay(semester, today, events))
    dayNote = t('today.freeDay');
  const backupDue = isBackupDue(settings?.lastBackupAt, readings.some((r) => r.status !== 'not_started'));
  const upcoming = upcomingEvents(today, events, UPCOMING_WINDOW_DAYS, includeCommunity);

  return (
    <div className="stack">
      <PageHeader title={hello} subtitle={`${dateLine}${semesterLine ? ` · ${semesterLine}` : ''}`} />

      <Card className="highlight">
        <h2>{t('today.question')}</h2>
        {dayNote && <p className="muted" style={{ margin: 0 }}>{dayNote}</p>}
      </Card>

      {backupDue && (
        <div className="spread card highlight">
          <strong>{t('backup.reminder')}</strong>
          <Link className="btn" to="/more">{t('backup.reminderGo')}</Link>
        </div>
      )}

      {todayLessons.length > 0 && timetable && (
        <Card title={t('today.lessonsTitle')}>
          <LessonList date={today} lessons={todayLessons} courseNames={timetable.courseNames} />
        </Card>
      )}

      {week !== null && (
        <section>
          <h2 className="section-title">{t('today.weekReadingTitle', { week })}</h2>
          {weekReadings.length === 0 ? (
            <Card><Empty>{t('today.weekReadingEmpty')}</Empty></Card>
          ) : (
            <div className="stack">
              {weekReadings.map((r) => <ReadingRow key={r.id} item={r} courseName={r.courseName} />)}
            </div>
          )}
        </section>
      )}

      {semester && <ExamPeriodCard semester={semester} today={today} />}

      <Card title={t('today.upcomingTitle')}>
        {upcoming.length === 0 ? (
          <Empty>{t('today.upcomingEmpty')}</Empty>
        ) : (
          upcoming.map((e) => (
            <div className="event" key={e.id}>
              <span className="event-date">{formatShortDate(e.start)}</span>
              <span>
                {e.title}
                {e.note && <span className="muted small"> · {e.note}</span>}
              </span>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
