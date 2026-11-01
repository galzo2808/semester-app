import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useActiveSemester, useCourse, useCourseLessons, useSemesterExams } from '../../data/repos';
import { formatDate, todayISO } from '../../domain/dates';
import { semesterWeek } from '../../domain/semester';
import type { StringKey } from '../../i18n/he';
import { useT } from '../../i18n/useT';
import { Badge, Empty, PageHeader } from '../../ui/components';
import { IconPrev } from '../../ui/icons';
import { MaterialsTab } from '../materials/MaterialsTab';
import { ReadingTab } from '../reading/ReadingTab';
import { TopicsTab } from '../topics/TopicsTab';

// Only tabs that work are shown; tasks (stage 4) and flashcards (stage 7) are added when built.
const TABS = ['reading', 'topics', 'materials'] as const;
type Tab = (typeof TABS)[number];

export function CoursePage() {
  const { t } = useT();
  const { id } = useParams();
  const course = useCourse(id);
  const semester = useActiveSemester();
  const [tab, setTab] = useState<Tab>('reading');
  const lessons = useCourseLessons(id) ?? [];
  const exams = (useSemesterExams(semester?.id) ?? []).filter((e) => e.courseId === id);

  if (course === undefined) return null; // loading
  if (course === null) return <Empty>{t('course.notFound')}</Empty>;

  const currentWeek = semester ? semesterWeek(semester, todayISO()) : null;

  return (
    <div>
      <Link to="/courses" className="row muted" style={{ textDecoration: 'none', minHeight: 'var(--tap)' }}>
        <span style={{ width: 20, height: 20, display: 'inline-flex' }}><IconPrev /></span>
        {t('course.back')}
      </Link>
      <PageHeader
        title={course.name}
        subtitle={
          <span className="row" style={{ flexWrap: 'wrap' }}>
            <Badge tone={course.department === 'psych' ? 'green' : 'blue'}>{t(`dept.${course.department}`)}</Badge>
            {course.credits && <Badge tone="muted">{t('course.credits', { n: course.credits })}</Badge>}
            {course.lecturer && <span>{t('course.lecturer', { name: course.lecturer })}</span>}
          </span>
        }
      />
      {(lessons.length > 0 || exams.length > 0) && (
        <div className="card" style={{ marginBottom: 12 }}>
          {[...lessons]
            .sort((a, b) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime))
            .map((l) => (
              <div key={l.id} className="row small" style={{ flexWrap: 'wrap', minHeight: 28 }}>
                <strong>{t(`weekday.${l.weekday}` as StringKey)}</strong>
                <span dir="ltr">{l.startTime}–{l.endTime}</span>
                <span className="muted">{t(`lesson.kind.${l.kind}`)}{l.location ? ` · ${l.location}` : ''}</span>
              </div>
            ))}
          {exams.map((e) => (
            <div key={e.id} className="row small" style={{ minHeight: 28 }}>
              <strong>{t(e.moed === 'a' ? 'exams.moedA' : 'exams.moedB')}</strong>
              <span>{formatDate(e.date)}</span>
            </div>
          ))}
        </div>
      )}
      {course.notes && <p className="course-notes">{course.notes}</p>}
      <div className="tabs" role="tablist">
        {TABS.map((key) => (
          <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}>
            {t(`course.tab.${key}`)}
          </button>
        ))}
      </div>
      {tab === 'reading' && <ReadingTab courseId={course.id} />}
      {tab === 'topics' && <TopicsTab courseId={course.id} currentWeek={currentWeek} />}
      {tab === 'materials' && <MaterialsTab courseId={course.id} />}
    </div>
  );
}
