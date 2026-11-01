import { useEffect, useState } from 'react';
import { FEEDBACK_URL } from '../../config';
import { updateSemester, updateSettings, useActiveSemester, useGeneralLinks, useSemesters, useSettings } from '../../data/repos';
import { OFFICIAL_CALENDAR_URL } from '../../data/seed/calendar5787';
import { getStorageInfo, requestPersistentStorage, type StorageInfo } from '../../data/storage';
import { formatDate } from '../../domain/dates';
import type { Gender } from '../../domain/types';
import { formatBytes, type StringKey } from '../../i18n/he';
import { useT } from '../../i18n/useT';
import { Card, PageHeader, Segmented } from '../../ui/components';
import { BackupCard } from '../backup/BackupCard';
import { LinkList } from '../materials/LinkList';

const WEEKDAYS = [0, 1, 2, 3, 4, 5];

export function MorePage() {
  const { t, gender } = useT();
  const settings = useSettings();
  const semesters = useSemesters() ?? [];
  const semester = useActiveSemester();
  const generalLinks = useGeneralLinks() ?? [];
  const [storage, setStorage] = useState<StorageInfo | null>(null);

  useEffect(() => {
    requestPersistentStorage().then(getStorageInfo).then(setStorage);
  }, []);

  if (!settings) return null;

  const toggleDay = (day: number) => {
    if (!semester) return;
    const days = semester.studyDays.includes(day)
      ? semester.studyDays.filter((d) => d !== day)
      : [...semester.studyDays, day].sort();
    updateSemester(semester.id, { studyDays: days });
  };

  return (
    <div className="stack">
      <PageHeader title={t('more.title')} />

      <BackupCard />

      <Card title={t('more.profile')}>
        <div className="stack">
          <div className="field">
            <label>{t('more.gender')}</label>
            <Segmented<Gender>
              label={t('more.gender')}
              value={settings.gender}
              onChange={(g) => updateSettings({ gender: g })}
              options={[
                { value: 'm', label: t('gender.m') },
                { value: 'f', label: t('gender.f') },
              ]}
            />
          </div>
          <div className="field">
            <label htmlFor="name">{t('more.name')}</label>
            <input
              id="name"
              className="input"
              value={settings.displayName}
              onChange={(e) => updateSettings({ displayName: e.target.value })}
              autoComplete="given-name"
            />
          </div>
        </div>
      </Card>

      <Card title={t('more.semester')}>
        <div className="stack">
          <div className="field">
            <label htmlFor="semester">{t('more.activeSemester')}</label>
            <select
              id="semester"
              className="select"
              value={settings.activeSemesterId}
              onChange={(e) => updateSettings({ activeSemesterId: e.target.value })}
            >
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {semester && (
              <span className="muted small">
                {t('more.semesterDates', { start: formatDate(semester.startDate), end: formatDate(semester.endDate) })}
              </span>
            )}
          </div>
          {semester && (
            <div className="field">
              <label>{t('more.studyDays')}</label>
              <div className="chips" role="group" aria-label={t('more.studyDays')}>
                {WEEKDAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={semester.studyDays.includes(d)}
                    aria-label={t(`weekday.${d}` as StringKey)}
                    onClick={() => toggleDay(d)}
                  >
                    {t(`weekdayShort.${d}` as StringKey)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card title={t('more.calendar')}>
        <label className="switch">
          <span>{t('more.communityHolidays')}</span>
          <input
            type="checkbox"
            checked={settings.showCommunityHolidays}
            onChange={(e) => updateSettings({ showCommunityHolidays: e.target.checked })}
          />
        </label>
        <a className="btn block" href={OFFICIAL_CALENDAR_URL} target="_blank" rel="noopener noreferrer">
          {t('more.officialCalendar')}
        </a>
      </Card>

      {generalLinks.length > 0 && (
        <section>
          <h2 className="section-title">{t('more.links')}</h2>
          <LinkList links={generalLinks} grouped={false} />
        </section>
      )}

      <Card title={t('more.storage')}>
        {storage?.usage !== undefined && storage.quota !== undefined ? (
          <p style={{ margin: 0 }}>
            {t('more.storageUsage', { used: formatBytes(storage.usage, gender), quota: formatBytes(storage.quota, gender) })}
          </p>
        ) : (
          <p style={{ margin: 0 }}>{t('more.storageUnknown')}</p>
        )}
        {storage && (
          <p className="muted small" style={{ margin: '4px 0 0' }}>
            {storage.persisted ? t('more.persisted') : t('more.notPersisted')}
          </p>
        )}
      </Card>

      <Card title={t('more.about')}>
        <div className="stack">
          <span>{t('more.version', { version: __APP_VERSION__ })}</span>
          {FEEDBACK_URL && (
            <a className="btn block" href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer">
              {t('more.feedback')}
            </a>
          )}
          <span className="muted small">{t('more.disclaimer')}</span>
        </div>
      </Card>
    </div>
  );
}
