import { useSemesterExams } from '../../data/repos';
import { daysBetween, formatDate, type ISODate } from '../../domain/dates';
import type { Semester } from '../../domain/types';
import { inDays } from '../../i18n/he';
import { useT } from '../../i18n/useT';
import { Card } from '../../ui/components';

/** Countdown to the start of the semester's exam period. */
export function ExamPeriodCard({ semester, today }: { semester: Semester; today: ISODate }) {
  const { t, gender } = useT();
  const start = semester.examsStartDate;
  const next = (useSemesterExams(semester.id) ?? []).find((e) => e.attending && e.date >= today);
  const nextLine = next && (
    <p style={{ margin: '8px 0 0' }}>
      {t('exams.next', { course: next.courseName })}
      <span className="muted small"> · {t('exams.when', { date: formatDate(next.date), when: inDays(daysBetween(today, next.date), gender) })}</span>
    </p>
  );

  if (!start) {
    return (
      <Card title={t('exams.period')}>
        <p className="muted">{t('exams.periodUnknown')}</p>
      </Card>
    );
  }

  const days = daysBetween(today, start);
  return (
    <Card title={t('exams.period')}>
      {days > 0 ? (
        <>
          <div className="countdown">
            <strong>{days}</strong>
            <span>{t('exams.daysLeft')}</span>
          </div>
          <p className="muted small" style={{ margin: '4px 0 0' }}>
            {t('exams.periodCountdown', { when: inDays(days, gender) })} · {formatDate(start)}
          </p>
          {nextLine}
        </>
      ) : (
        <>
          <p style={{ margin: 0 }}>{t('exams.periodStarted', { date: formatDate(start) })}</p>
          {nextLine}
        </>
      )}
    </Card>
  );
}
