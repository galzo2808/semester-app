import { Link } from 'react-router-dom';
import { useActiveSemester, useCourses } from '../../data/repos';
import type { Department } from '../../domain/types';
import { useT } from '../../i18n/useT';
import { Empty, PageHeader } from '../../ui/components';

const DEPARTMENTS: Department[] = ['psych', 'econ'];

export function CoursesPage() {
  const { t } = useT();
  const semester = useActiveSemester();
  const courses = useCourses(semester?.id) ?? [];

  return (
    <div>
      <PageHeader title={t('courses.title')} subtitle={semester?.name} />
      {courses.length === 0 && <Empty>{t('courses.empty')}</Empty>}
      {DEPARTMENTS.map((dept) => {
        const list = courses.filter((c) => c.department === dept);
        if (list.length === 0) return null;
        return (
          <section key={dept}>
            <h2 className="section-title">
              {t(`dept.${dept}`)} · {t('courses.count', { n: list.length })}
            </h2>
            <div className="stack">
              {list.map((c) => (
                <Link key={c.id} to={`/courses/${c.id}`} className="card">
                  <strong>{c.name}</strong>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
