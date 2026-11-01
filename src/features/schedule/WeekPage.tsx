import { useState } from 'react';
import { useActiveSemester, useCalendarEvents, useSettings, useTimetable } from '../../data/repos';
import { eventsOn } from '../../domain/calendar';
import { addDays, formatShortDate, startOfWeek, todayISO } from '../../domain/dates';
import { lessonsOn } from '../../domain/schedule';
import { isStudyDay, semesterWeek } from '../../domain/semester';
import type { StringKey } from '../../i18n/he';
import { useT } from '../../i18n/useT';
import { Badge, PageHeader } from '../../ui/components';
import { IconNext, IconPrev } from '../../ui/icons';
import { LessonList } from './LessonList';

const DAYS_SHOWN = 6; // Sunday–Friday

export function WeekPage() {
  const { t } = useT();
  const settings = useSettings();
  const semester = useActiveSemester();
  const events = useCalendarEvents() ?? [];
  const timetable = useTimetable(semester?.id);
  const today = todayISO();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(today));

  const days = Array.from({ length: DAYS_SHOWN }, (_, i) => addDays(weekStart, i));
  const weekEnd = days[days.length - 1];
  // A week counts as a semester week if any of its days does (handles a mid-week start).
  const week = semester ? days.map((d) => semesterWeek(semester, d)).find((w) => w !== null) ?? null : null;
  const isCurrentWeek = weekStart === startOfWeek(today);

  return (
    <div className="stack">
      <PageHeader
        title={week !== null ? t('week.title', { week }) : t('week.titleOutside')}
        subtitle={t('week.range', { from: formatShortDate(weekStart), to: formatShortDate(weekEnd) })}
      />

      <div className="spread">
        <button className="icon-btn" aria-label={t('week.prev')} onClick={() => setWeekStart(addDays(weekStart, -7))}>
          <IconPrev />
        </button>
        <button className="btn" disabled={isCurrentWeek} onClick={() => setWeekStart(startOfWeek(today))}>
          {t('week.backToToday')}
        </button>
        <button className="icon-btn" aria-label={t('week.next')} onClick={() => setWeekStart(addDays(weekStart, 7))}>
          <IconNext />
        </button>
      </div>

      {days.map((d, i) => {
        const dayEvents = eventsOn(d, events, settings?.showCommunityHolidays ?? false);
        const studyDay = semester ? isStudyDay(semester, d, events) : false;
        const dayLessons =
          semester && timetable ? lessonsOn(d, semester, timetable.lessons, timetable.changes, events) : [];
        const isToday = d === today;
        return (
          <section key={d} className={`card ${isToday ? 'today' : ''} ${studyDay || dayLessons.length ? '' : 'off'}`}>
            <div className="spread">
              <h2 style={{ margin: 0 }}>
                {t(`weekday.${i}` as StringKey)} <span className="muted small">{formatShortDate(d)}</span>
              </h2>
              <div className="row">
                {isToday && <Badge>{t('week.today')}</Badge>}
                {studyDay && <Badge tone="green">{t('week.studyDay')}</Badge>}
              </div>
            </div>
            {dayEvents.map((e) => (
              <p key={e.id} style={{ margin: '8px 0 0' }}>
                <strong>{e.title}</strong>
                {e.note && <span className="muted small"> · {e.note}</span>}
              </p>
            ))}
            {dayLessons.length > 0 && timetable && (
              <LessonList date={d} lessons={dayLessons} courseNames={timetable.courseNames} />
            )}
            {studyDay && dayLessons.length === 0 && (
              <p className="muted small" style={{ margin: '8px 0 0' }}>{t('week.lessonsEmpty')}</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
