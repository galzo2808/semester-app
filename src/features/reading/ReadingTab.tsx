import { useState } from 'react';
import { setReadingStatus, setReadingUrl, useReadings } from '../../data/repos';
import { normalizeUrl, scholarSearchUrl } from '../../domain/links';
import { byPriority, nextReadingStatus } from '../../domain/reading';
import type { ReadingItem, Requirement } from '../../domain/types';
import { useT } from '../../i18n/useT';
import { Badge, Empty } from '../../ui/components';

const REQ_TONE: Record<Requirement, 'blue' | 'green' | 'muted'> = {
  required: 'blue',
  unverified: 'muted',
  recommended: 'green',
  optional: 'muted',
};

/** A course's reading log: books, articles and media, each with a tap-to-advance status and a link. */
export function ReadingTab({ courseId }: { courseId: string }) {
  const { t } = useT();
  const items = useReadings(courseId);
  if (!items) return null;
  if (items.length === 0) return <Empty>{t('reading.empty')}</Empty>;

  const groups: [string, ReadingItem[]][] = [
    [t('reading.books'), items.filter((r) => r.kind === 'book')],
    [t('reading.articles'), [...items.filter((r) => r.kind === 'article')].sort(byPriority)],
    [t('reading.media'), items.filter((r) => r.kind === 'media')],
  ];

  return (
    <div>
      <p className="muted small" style={{ margin: 0 }}>{t('reading.statusHint')}</p>
      {groups.map(([label, list]) =>
        list.length === 0 ? null : (
          <section key={label}>
            <h2 className="section-title">{label}</h2>
            <div className="stack">
              {list.map((r) => <ReadingRow key={r.id} item={r} />)}
            </div>
          </section>
        ),
      )}
    </div>
  );
}

export function ReadingRow({ item: r, courseName }: { item: ReadingItem; courseName?: string }) {
  const { t } = useT();
  const [editing, setEditing] = useState(false);
  const weeks =
    r.syllabusWeek === undefined
      ? null
      : r.syllabusWeekEnd && r.syllabusWeekEnd !== r.syllabusWeek
        ? t('reading.weeks', { from: r.syllabusWeek, to: r.syllabusWeekEnd })
        : t('reading.week', { week: r.syllabusWeek });

  return (
    <article className="card">
      <div className="item">
        <div className="item-main">
          {courseName && <span className="muted small">{courseName}</span>}
          <strong>{r.title}</strong>
          {r.author && <span className="small">{r.author}</span>}
          {r.chaptersOrPages && <span>{r.chaptersOrPages}</span>}
          <div className="row" style={{ flexWrap: 'wrap' }}>
            <Badge tone={REQ_TONE[r.requirement]}>{t(`reading.req.${r.requirement}`)}</Badge>
            {weeks && <Badge tone="muted">{weeks}</Badge>}
          </div>
          {r.notes && <span className="muted small">{r.notes}</span>}
        </div>
        <div className="item-actions">
          <button
            className={`status-btn status-${r.status}`}
            onClick={() => setReadingStatus(r.id, nextReadingStatus(r.status))}
          >
            {t(`reading.status.${r.status}`)}
          </button>
          {r.url ? (
            // target=_blank: from the installed app this opens the phone's browser.
            <a className="btn" href={r.url} target="_blank" rel="noopener noreferrer">{t('reading.open')}</a>
          ) : (
            <button className="btn" onClick={() => setEditing(true)}>{t('reading.addLink')}</button>
          )}
        </div>
      </div>
      {r.url && !editing && (
        <button className="text-btn" onClick={() => setEditing(true)}>{t('reading.editLink')}</button>
      )}
      {editing && <LinkEditor item={r} onDone={() => setEditing(false)} />}
    </article>
  );
}

function LinkEditor({ item, onDone }: { item: ReadingItem; onDone: () => void }) {
  const { t } = useT();
  const [value, setValue] = useState(item.url ?? '');
  const [invalid, setInvalid] = useState(false);
  const inputId = `link-${item.id}`;

  const save = async () => {
    const url = normalizeUrl(value);
    if (!url) return setInvalid(true);
    await setReadingUrl(item.id, url);
    onDone();
  };

  return (
    <div className="link-editor">
      <label htmlFor={inputId} className="small">{t('reading.linkLabel')}</label>
      <input
        id={inputId}
        className="input"
        type="url"
        inputMode="url"
        dir="ltr"
        autoFocus
        placeholder={t('reading.linkPlaceholder')}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setInvalid(false);
        }}
        onKeyDown={(e) => e.key === 'Enter' && save()}
      />
      {invalid && <span className="small error-text">{t('reading.linkInvalid')}</span>}
      <div className="row" style={{ flexWrap: 'wrap' }}>
        <button className="btn primary" onClick={save}>{t('reading.linkSave')}</button>
        <button className="btn" onClick={onDone}>{t('reading.linkCancel')}</button>
        {item.url && (
          <button className="text-btn" onClick={() => setReadingUrl(item.id, '').then(onDone)}>
            {t('reading.linkRemove')}
          </button>
        )}
      </div>
      {item.kind !== 'media' && (
        <a className="small" href={scholarSearchUrl(item.title, item.author)} target="_blank" rel="noopener noreferrer">
          {t('reading.searchScholar')}
        </a>
      )}
    </div>
  );
}
