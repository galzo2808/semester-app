import { Link } from 'react-router-dom';
import { toggleLessonCancelled } from '../../data/repos';
import type { DayLesson } from '../../domain/schedule';
import { useT } from '../../i18n/useT';
import { Badge } from '../../ui/components';

/**
 * One day's lessons: time, course (links to the course page), type, room.
 * The small button marks a lesson cancelled for this date only (the timetable is a base that changes).
 */
export function LessonList({
  date,
  lessons,
  courseNames,
}: {
  date: string;
  lessons: DayLesson[];
  courseNames: Map<string, string>;
}) {
  const { t } = useT();
  return (
    <div>
      {lessons.map((l) => (
        <div key={l.key} className={`lesson ${l.cancelled ? 'cancelled' : ''}`}>
          {/* Times read left-to-right; without dir=ltr the range flips in RTL. */}
          <span className="lesson-time" dir="ltr">{l.startTime}–{l.endTime}</span>
          <div className="lesson-main">
            <Link to={`/courses/${l.courseId}`} className="lesson-course">{courseNames.get(l.courseId)}</Link>
            <span className="row small muted" style={{ flexWrap: 'wrap' }}>
              {l.kind !== 'lecture' && <span>{t(`lesson.kind.${l.kind}`)}</span>}
              {l.location && <span>{l.location}</span>}
              {l.cancelled && <Badge tone="muted">{t('lesson.cancelled')}</Badge>}
              {l.extra && <Badge tone="green">{t('lesson.extra')}</Badge>}
            </span>
            {l.note && <span className="small">{l.note}</span>}
          </div>
          <button className="lesson-toggle" onClick={() => toggleLessonCancelled(date, l)}>
            {t(l.extra ? 'lesson.removeExtra' : l.cancelled ? 'lesson.restore' : 'lesson.markCancelled')}
          </button>
        </div>
      ))}
    </div>
  );
}
