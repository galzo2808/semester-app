import { useRegisterSW } from 'virtual:pwa-register/react';
import { useT } from '../i18n/useT';

/** Shows a banner when a new version was downloaded; data is kept, only the app code updates. */
export function UpdatePrompt() {
  const { t } = useT();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;
  return (
    <div className="update-banner" role="status">
      <span>{t('update.available')}</span>
      <button className="btn ghost" onClick={() => setNeedRefresh(false)}>{t('update.later')}</button>
      <button className="btn" onClick={() => updateServiceWorker(true)}>{t('update.apply')}</button>
    </div>
  );
}
