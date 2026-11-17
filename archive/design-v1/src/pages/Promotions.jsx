import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context.jsx';
import { useI18n } from '../i18n.jsx';
import { PageIntro, StatusBadge } from '../components/ui.jsx';

const EMPTY = { code: '', discount: '', limit: '' };

export default function Promotions() {
  const { promos, setPromos, notify } = useApp();
  const { t, fmt, pct } = useI18n();
  const [form, setForm] = useState(EMPTY);
  const [errorCode, setErrorCode] = useState('');
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    const discount = Number(form.discount);
    const limit = Number(form.limit);
    if (promos.some((p) => p.code === code)) {
      setErrorCode(code);
      return;
    }
    setPromos((list) => [{ code, discount, limit, used: 0, active: true }, ...list]);
    setForm(EMPTY);
    setErrorCode('');
    notify(t('promo.created', { code }));
  };

  const toggle = (code) => setPromos((list) => list.map((p) => (p.code === code ? { ...p, active: !p.active } : p)));

  return (
    <div className="page">
      <PageIntro title={t('nav.promotions')} subtitle={t('promo.subtitle')} />
      <section className="card panel">
        <h3>{t('promo.new')}</h3>
        <form className="form-grid" onSubmit={submit}>
          <label className="field">
            {t('promo.code')}
            <input required maxLength={16} pattern="[A-Za-z0-9]+" title={t('promo.codeHint')} value={form.code} onChange={set('code')} placeholder="SUMMER20" />
          </label>
          <label className="field">
            {t('promo.discount')}
            <input required type="number" min="1" max="100" value={form.discount} onChange={set('discount')} placeholder="20" />
          </label>
          <label className="field">
            {t('promo.limit')}
            <input required type="number" min="1" value={form.limit} onChange={set('limit')} placeholder="500" />
          </label>
          <button type="submit" className="btn" style={{ minHeight: 40 }}>
            <Plus size={16} /> {t('promo.create')}
          </button>
        </form>
        {errorCode && (
          <p role="alert" style={{ color: 'var(--bad)', marginTop: 10 }}>
            {t('promo.exists', { code: errorCode })}
          </p>
        )}
      </section>
      <section className="card panel">
        <h3>{t('promo.all')}</h3>
        <div className="table-wrap">
          <table className="table" style={{ minWidth: 620 }}>
            <thead>
              <tr>
                <th>{t('promo.code')}</th>
                <th>{t('promo.reduction')}</th>
                <th>{t('promo.used')}</th>
                <th>{t('promo.status')}</th>
                <th>{t('promo.enabled')}</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((p) => (
                <tr key={p.code}>
                  <td>{p.code}</td>
                  <td>{pct(p.discount)}</td>
                  <td>
                    {fmt(p.used)} / {fmt(p.limit)}
                  </td>
                  <td>
                    <StatusBadge status={p.active ? 'Active' : 'Paused'} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="toggle"
                      role="switch"
                      aria-checked={p.active}
                      aria-label={t('promo.enable', { code: p.code })}
                      onClick={() => toggle(p.code)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
