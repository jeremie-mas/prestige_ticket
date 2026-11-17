import { useState } from 'react';
import { useApp } from '../context.jsx';
import { useI18n } from '../i18n.jsx';
import { PageIntro } from '../components/ui.jsx';

const PREFERENCES = ['sales', 'payouts', 'weekly'];

export default function Settings() {
  const { user, setUser, notify } = useApp();
  const { t } = useI18n();
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [prefs, setPrefs] = useState({ sales: true, payouts: true, weekly: false });

  const save = (e) => {
    e.preventDefault();
    setUser((u) => ({ ...u, name: form.name.trim(), email: form.email.trim() }));
    notify(t('settings.saved'));
  };

  return (
    <div className="page">
      <PageIntro title={t('nav.settings')} subtitle={t('settings.subtitle')} />
      <section className="card panel">
        <h3>{t('settings.profile')}</h3>
        <form className="form-grid" onSubmit={save}>
          <label className="field">
            {t('settings.name')}
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="field">
            {t('settings.email')}
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="field">
            {t('settings.role')}
            <input readOnly value={t(`role.${user.role}`)} />
          </label>
          <button type="submit" className="btn" style={{ minHeight: 40 }}>
            {t('settings.save')}
          </button>
        </form>
      </section>
      <section className="card panel">
        <h3>{t('settings.notifications')}</h3>
        {PREFERENCES.map((key) => (
          <div className="setting-row" key={key}>
            <div>
              {t(`settings.pref.${key}`)}
              <small>{t(`settings.pref.${key}Hint`)}</small>
            </div>
            <button
              type="button"
              className="toggle"
              role="switch"
              aria-checked={prefs[key]}
              aria-label={t(`settings.pref.${key}`)}
              onClick={() => setPrefs((v) => ({ ...v, [key]: !v[key] }))}
            />
          </div>
        ))}
      </section>
    </div>
  );
}
