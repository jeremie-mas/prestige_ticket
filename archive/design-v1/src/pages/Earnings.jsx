import { COLORS, earningsMonthly, events } from '../data.js';
import { useI18n } from '../i18n.jsx';
import { GroupedBars } from '../components/charts.jsx';
import { MiniStat, PageIntro } from '../components/ui.jsx';

export default function Earnings() {
  const { t, fmt, pct } = useI18n();
  const rows = earningsMonthly.map((m) => ({ ...m, label: t(m.label) }));
  const total = rows.reduce((sum, m) => sum + m.revenue, 0);
  const best = rows.reduce((a, b) => (b.revenue > a.revenue ? b : a));

  return (
    <div className="page">
      <PageIntro title={t('nav.earnings')} subtitle={t('earnings.subtitle')} />
      <div className="mini-grid">
        <MiniStat label={t('earnings.total')} value={fmt(total)} />
        <MiniStat label={t('earnings.best')} value={best.label} hint={t('earnings.bestHint', { n: best.revenue })} />
        <MiniStat label={t('earnings.thisMonth')} value={rows.at(-1).revenue} />
      </div>
      <section className="card panel">
        <h3>{t('earnings.monthly')}</h3>
        <GroupedBars
          rows={rows}
          series={[{ key: 'revenue', label: t('earnings.total'), color: COLORS.festival }]}
          max={100}
          step={20}
          maxBar={26}
          height={300}
          defaultActive={{ group: rows.length - 1, key: 'revenue' }}
          caption={t('earnings.monthly')}
          formatValue={(v) => t('earnings.value', { n: v })}
          tooltipLabel={(_, row) => row.label}
        />
      </section>
      <section className="card panel">
        <h3>{t('earnings.byEvent')}</h3>
        <div className="table-wrap">
          <table className="table" style={{ minWidth: 560 }}>
            <thead>
              <tr>
                <th>{t('earnings.event')}</th>
                <th>{t('earnings.city')}</th>
                <th>{t('earnings.sold')}</th>
                <th>{t('earnings.capacity')}</th>
              </tr>
            </thead>
            <tbody>
              {[...events]
                .sort((a, b) => b.sold - a.sold)
                .map((e) => (
                  <tr key={e.id}>
                    <td>{e.name}</td>
                    <td>{e.city}</td>
                    <td>{fmt(e.sold)}</td>
                    <td>{pct(Math.round((e.sold / e.capacity) * 100))}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
