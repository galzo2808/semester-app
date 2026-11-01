import { Link } from 'react-router-dom';
import { useActiveSemester, useCalendarEvents, useSemesterExams } from '../../data/repos';
import { addDays, daysBetween, formatDate, todayISO, weekday } from '../../domain/dates';
import type { StringKey } from '../../i18n/he';
import { useT } from '../../i18n/useT';
import { Card, Empty, PageHeader } from '../../ui/components';
import { ExamPeriodCard } from './ExamPeriodCard';

/** Exam dates with a countdown, ordered by moed A. Moed B is shown under each course. */
export function ExamsPage() {
  const { t } = useT();
  const semester = useActiveSemester();
  const exams = useSemesterExams(semester?.id) ?? [];
  const events = useCalendarEvents() ?? [];
  const today = todayISO();

  const moedA = exams.filter((e) => e.moed === 'a');
  const moedB = new Map(exams.filter((e) => e.moed === 'b').map((e) => [e.courseId, e]));
  // Exam-type calendar events from the semester start through its exam periods (moed B ends ~3 months later).
  const otherExams = semester
    ? events.filter((e) => e.kind === 'exam' && e.start >= semester.startDate && e.start <= addDays(semester.endDate, 120))
    : [];
  const dayLabel = (iso: string) => `${t(`weekday.${weekday(iso)}` as StringKey)}, ${formatDate(iso)}`;

  return (
    <div className="stack">
      <PageHeader title={t('exams.title')} subtitle={semester?.name} />
      {semester && <ExamPeriodCard semester={semester} today={today} />}
      {moedA.length === 0 && <Card><Empty>{t('exams.empty')}</Empty></Card>}
      {moedA.length > 0 && <p className="muted small" style={{ margin: 0 }}>{t('exams.timeTbd')}</p>}

      {moedA.map((e) => {
        const days = daysBetween(today, e.date);
        const b = moedB.get(e.courseId);
        return (
          <section key={e.id} className="card exam-row">
            <div className="stack" style={{ gap: 2 }}>
              <Link to={`/courses/${e.courseId}`} className="lesson-course">{e.courseName}</Link>
              <span>{t('exams.moedA')}: {dayLabel(e.date)}</span>
              {b && <span className="muted small">{t('exams.moedB')}: {dayLabel(b.date)}</span>}
            </div>
            <div className="exam-days">
              {days >= 0 ? (
                <>
                  <strong>{days}</strong>
                  <span className="small muted">{t('exams.daysLeft')}</span>
                </>
              ) : (
                <span className="small muted">{t('exams.past')}</span>
              )}
            </div>
          </section>
        );
      })}

      {otherExams.length > 0 && (
        <section>
          <h2 className="section-title">{t('exams.other')}</h2>
          <div className="stack">
            {otherExams.map((e) => (
              <section key={e.id} className="card exam-row">
                <div className="stack" style={{ gap: 2 }}>
                  <strong>{e.title}</strong>
                  <span>{dayLabel(e.start)}</span>
                  {e.note && <span className="muted small">{e.note}</span>}
                </div>
                <div className="exam-days">
                  <strong>{Math.max(0, daysBetween(today, e.start))}</strong>
                  <span className="small muted">{t('exams.daysLeft')}</span>
                </div>
              </section>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
