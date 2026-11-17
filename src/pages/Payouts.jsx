import { useState } from 'react';
import { useApp } from '../context.jsx';
import { useI18n } from '../i18n.jsx';
import { MiniStat, PageIntro, StatusBadge } from '../components/ui.jsx';

export default function Payouts() {
  const { payouts, setPayouts, notify } = useApp();
  const { t, money } = useI18n();
  const [decided, setDecided] = useState([]);
  const pending = payouts.filter((p) => p.status === 'Pending');
  const pendingTotal = pending.reduce((sum, p) => sum + p.amount, 0);

  const decide = (payout, status) => {
    setDecided((list) => [...list, payout.id]);
    setPayouts((list) => list.map((p) => (p.id === payout.id ? { ...p, status } : p)));
    notify(t(`payouts.toast.${status}`, { id: payout.id }));
  };

  return (
    <div className="page">
      <PageIntro title={t('nav.payouts')} subtitle={t('payouts.subtitle')} />
      <div className="mini-grid">
        <MiniStat label={t('payouts.waiting')} value={pending.length} />
        <MiniStat label={t('payouts.pendingAmount')} value={pendingTotal} format={money} />
        <MiniStat label={t('payouts.approved')} value={payouts.filter((p) => p.status === 'Approved').length} />
      </div>
      <section className="card panel">
        <h3>{t('payouts.requests')}</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('payouts.request')}</th>
                <th>{t('payouts.organizer')}</th>
                <th>{t('payouts.event')}</th>
                <th>{t('payouts.amount')}</th>
                <th>{t('payouts.requested')}</th>
                <th>{t('payouts.status')}</th>
                <th>{t('payouts.action')}</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.organizer}</td>
                  <td>{p.event}</td>
                  <td>{money(p.amount)}</td>
                  <td>{p.requested}</td>
                  <td>
                    <StatusBadge key={p.status} status={p.status} fresh={decided.includes(p.id)} />
                  </td>
                  <td>
                    {p.status === 'Pending' ? (
                      <div className="row-actions">
                        <button type="button" className="btn btn-small" onClick={() => decide(p, 'Approved')}>
                          {t('payouts.approve')}
                        </button>
                        <button type="button" className="btn btn-small btn-ghost" onClick={() => decide(p, 'Rejected')}>
                          {t('payouts.reject')}
                        </button>
                      </div>
                    ) : (
                      '—'
                    )}
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
