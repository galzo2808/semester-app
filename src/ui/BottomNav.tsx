import { NavLink } from 'react-router-dom';
import type { StringKey } from '../i18n/he';
import { useT } from '../i18n/useT';
import { IconCourses, IconExams, IconMore, IconToday, IconWeek } from './icons';

const ITEMS: { to: string; label: StringKey; Icon: () => JSX.Element }[] = [
  { to: '/', label: 'nav.today', Icon: IconToday },
  { to: '/week', label: 'nav.week', Icon: IconWeek },
  { to: '/courses', label: 'nav.courses', Icon: IconCourses },
  { to: '/exams', label: 'nav.exams', Icon: IconExams },
  { to: '/more', label: 'nav.more', Icon: IconMore },
];

export function BottomNav() {
  const { t } = useT();
  return (
    <nav className="bottom-nav" aria-label={t('app.name')}>
      <ul>
        {ITEMS.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink to={to} end={to === '/'}>
              <Icon />
              {t(label)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
