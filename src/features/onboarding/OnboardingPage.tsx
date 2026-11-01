import { useState } from 'react';
import { updateSettings } from '../../data/repos';
import type { Gender } from '../../domain/types';
import { t } from '../../i18n/he';
import { Segmented } from '../../ui/components';

/** First-run screen: form of address and an optional first name. */
export function OnboardingPage() {
  const [gender, setGender] = useState<Gender>('m');
  const [name, setName] = useState('');

  const start = () => updateSettings({ gender, displayName: name.trim(), onboarded: true });

  return (
    <main className="onboarding stack">
      <img className="logo" src="./icon.svg" alt="" />
      <h1>{t('onboarding.title', gender)}</h1>
      <p className="muted" style={{ margin: 0 }}>{t('onboarding.subtitle', gender)}</p>

      <div className="field" style={{ marginTop: 16 }}>
        <label>{t('onboarding.genderQuestion', gender)}</label>
        <Segmented<Gender>
          label={t('onboarding.genderQuestion', gender)}
          value={gender}
          onChange={setGender}
          options={[
            { value: 'm', label: t('gender.m', gender) },
            { value: 'f', label: t('gender.f', gender) },
          ]}
        />
      </div>

      <div className="field">
        <label htmlFor="onb-name">{t('onboarding.nameLabel', gender)}</label>
        <input
          id="onb-name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="given-name"
        />
      </div>

      <button className="btn primary block" style={{ marginTop: 8 }} onClick={start}>
        {t('onboarding.start', gender)}
      </button>
      <p className="muted small" style={{ margin: 0, textAlign: 'center' }}>{t('onboarding.privacy', gender)}</p>
    </main>
  );
}
