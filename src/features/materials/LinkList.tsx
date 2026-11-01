import type { CourseLink, LinkCategory } from '../../domain/types';
import { useT } from '../../i18n/useT';

const ORDER: LinkCategory[] = ['exam', 'reading', 'lectures', 'practice', 'folder', 'general'];

/** External links grouped by category; each opens in a new tab. */
export function LinkList({ links, grouped = true }: { links: CourseLink[]; grouped?: boolean }) {
  const { t } = useT();
  const groups = grouped
    ? ORDER.map((c) => [c, links.filter((l) => l.category === c)] as const).filter(([, l]) => l.length > 0)
    : ([['general', links]] as const);

  return (
    <div>
      {groups.map(([cat, list]) => (
        <section key={cat}>
          {grouped && <h2 className="section-title">{t(`materials.cat.${cat}`)}</h2>}
          <div className="stack">
            {list.map((l) => (
              <a key={l.id} className="card link-card" href={l.url} target="_blank" rel="noopener noreferrer">
                <strong>{l.title}</strong>
                {l.source && <span className="muted small">{l.source}</span>}
                {l.note && <span className="small">{l.note}</span>}
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
