import { useCourseLinks } from '../../data/repos';
import { useT } from '../../i18n/useT';
import { Empty } from '../../ui/components';
import { LinkList } from './LinkList';

export function MaterialsTab({ courseId }: { courseId: string }) {
  const { t } = useT();
  const links = useCourseLinks(courseId);
  if (!links) return null;
  if (links.length === 0) return <Empty>{t('materials.empty')}</Empty>;
  return (
    <div>
      <p className="muted small" style={{ margin: 0 }}>{t('materials.disclaimer')}</p>
      <LinkList links={links} />
    </div>
  );
}
