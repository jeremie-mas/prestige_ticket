import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, CircleDollarSign, Ellipsis, Ticket, TicketCheck, TicketPlus } from 'lucide-react';
import { salesData, salesSeries, stats, ticketSegments } from '../data.js';
import { useI18n } from '../i18n.jsx';
import { ChartLegend, Donut, GroupedBars } from '../components/charts.jsx';
import { Dropdown, Popover } from '../components/ui.jsx';
import BuyersTable from '../components/BuyersTable.jsx';

const ICONS = { ticket: Ticket, revenue: CircleDollarSign, sold: TicketCheck, available: TicketPlus };

function StatCard({ stat }) {
  const { t, fmt, pct } = useI18n();
  const Icon = ICONS[stat.icon];
  const up = stat.trend === 'up';
  const Arrow = up ? ChevronUp : ChevronDown;
  const title = t(`stat.${stat.key}`);
  const chip = stat.chipCount != null ? `+${fmt(stat.chipCount)}` : pct(stat.chipPct);
  return (
    <article className="card stat">
      <div className="stat-head">
        <span className="stat-icon">
          <Icon size={18} strokeWidth={1.8} />
        </span>
        <h3>{title}</h3>
        <Popover
          trigger={({ open, toggle }) => (
            <button type="button" className="icon-btn" aria-expanded={open} aria-label={t('stat.options', { name: title })} onClick={toggle}>
              <Ellipsis size={20} />
            </button>
          )}
        >
          {(close) => (
            <Link to={stat.to} className="menu-item" onClick={close}>
              {t('stat.details')}
            </Link>
          )}
        </Popover>
      </div>
      <div className="stat-body">
        <strong className="stat-value">{fmt(stat.value)}</strong>
        <span className={`stat-arrow ${up ? 'up' : 'down'}`} aria-hidden="true">
          <Arrow size={14} strokeWidth={2.5} />
        </span>
        <div className="stat-note">
          <span>
            {t(stat.prefix)} <em className={up ? 'chip-up' : 'chip-down'}>{chip}</em>
          </span>
          <span>{stat.suffixText ?? t(stat.suffix)}</span>
        </div>
      </div>
    </article>
  );
}

function TicketBreakdown() {
  const { t, fmt } = useI18n();
  const [view, setView] = useState('total');
  const segments = ticketSegments.map((s) => ({ ...s, label: t(`ticket.${s.key}`), state: t(`state.${s.state}`) }));
  const soldOnly = segments.filter((s) => s.key !== 'available');
  const sold = soldOnly.reduce((sum, s) => sum + s.value, 0);
  const available = segments.find((s) => s.key === 'available').value;

  return (
    <section className="card breakdown">
      <div className="crumbs" role="tablist" aria-label={t('breakdown.aria')}>
        <button type="button" role="tab" aria-selected={view === 'total'} className={view === 'total' ? 'on' : ''} onClick={() => setView('total')}>
          {t('breakdown.total')}
        </button>
        <span aria-hidden="true">/</span>
        <button type="button" role="tab" aria-selected={view === 'type'} className={view === 'type' ? 'on' : ''} onClick={() => setView('type')}>
          {t('breakdown.type')}
        </button>
      </div>
      {view === 'total' ? (
        <Donut
          key="total"
          segments={segments}
          defaultKey="festival"
          tooltipAngle={{ festival: 318 }}
          center={
            <>
              <p className="dc-top">
                <b>{fmt(sold)}</b> / <small>{fmt(available)}</small>
              </p>
              <p className="dc-bottom">
                <b>{t('state.sold')}</b> / <small>{t('state.available')}</small>
              </p>
            </>
          }
        />
      ) : (
        <Donut
          key="type"
          segments={soldOnly}
          defaultKey="festival"
          tooltipAngle={{ festival: 318 }}
          center={
            <>
              <p className="dc-top">
                <b>{fmt(sold)}</b>
              </p>
              <p className="dc-bottom">
                <b>{t('state.sold')}</b>
              </p>
            </>
          }
        />
      )}
    </section>
  );
}

function SalesAnalytics() {
  const { t } = useI18n();
  const [range, setRange] = useState('Weekly');
  const config = salesData[range];
  const series = salesSeries.map((s) => ({ ...s, label: t(`series.${s.key}`), legend: t(`ticket.${s.key}`) }));
  const rows = config.rows.map((row) => ({ ...row, label: t(row.label) }));
  return (
    <section className="card analytics">
      <div className="analytics-head">
        <h3>{t('chart.title')}</h3>
        <Dropdown
          label={t('chart.period')}
          value={range}
          options={Object.keys(salesData).map((value) => ({ value, label: t(`range.${value}`) }))}
          onChange={setRange}
        />
      </div>
      <ChartLegend items={[series[2], series[1], series[0]]} />
      <GroupedBars
        key={range}
        rows={rows}
        series={series}
        max={config.max}
        step={config.step}
        defaultActive={range === 'Weekly' ? { group: 3, key: 'vip' } : null}
        caption={t('chart.caption', { range: t(`range.${range}`).toLowerCase() })}
      />
    </section>
  );
}

export default function Dashboard() {
  return (
    <div className="dash">
      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.key} stat={stat} />
        ))}
      </div>
      <div className="charts-grid">
        <TicketBreakdown />
        <SalesAnalytics />
      </div>
      <BuyersTable />
    </div>
  );
}
