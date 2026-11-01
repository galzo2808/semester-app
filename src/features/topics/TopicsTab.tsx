import { useTopics } from '../../data/repos';
import { useT } from '../../i18n/useT';
import { Empty } from '../../ui/components';

/** Weekly syllabus topics. Confidence rating and review history come in stage 6. */
export function TopicsTab({ courseId, currentWeek }: { courseId: string; currentWeek: number | null }) {
  const { t } = useT();
  const topics = useTopics(courseId);
  if (!topics) return null;
  if (topics.length === 0) return <Empty>{t('topics.empty')}</Empty>;

  return (
    <div className="card">
      {topics.map((tp) => (
        <div key={tp.id} className={`event ${tp.week === currentWeek ? 'current' : ''}`}>
          <span className="event-date">{t('reading.week', { week: tp.week })}</span>
          <span>{tp.title}</span>
        </div>
      ))}
    </div>
  );
}
