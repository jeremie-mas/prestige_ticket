import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDownRight, ArrowUpRight, CalendarDays, ChevronRight, ChartNoAxesColumn, CircleDollarSign, Music2, PieChart } from 'lucide-react';
import { CAPACITY, earningsMonthly, events, salesData, salesSeries, stats, ticketSegments } from '../data.js';
import { useApp } from '../context.jsx';
import { useI18n } from '../i18n.jsx';
import { Count, useInView, useTilt } from '../motion.jsx';
import { Sparkline, StackedBars } from '../components/charts.jsx';
import { PageIntro, Seg } from '../components/ui.jsx';
import BuyersTable from '../components/BuyersTable.jsx';

const stat = (key) => stats.find((s) => s.key === key);

// Date de référence des données de démonstration togolaises.
const DEMO_TODAY = '2026-11-17';

function Delta({ trend, value }) {
  const Arrow = trend === 'up' ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`delta ${trend}`}>
      <Arrow size={14} aria-hidden="true" />
      {value}
    </span>
  );
}

function TileIcon({ icon: Icon, color }) {
  return (
    <span className="tile-icon" style={{ '--c': color }} aria-hidden="true">
      <Icon size={17} />
    </span>
  );
}

function TicketHero() {
  const { t, fmt, pct } = useI18n();
  const tilt = useTilt();
  const sold = stat('sold');
  const available = stat('available');
  const total = stat('total');
  const share = Math.round((sold.value / CAPACITY) * 1000) / 10;
  return (
    <section className="ticket span-hero" {...tilt}>
      <div className="ticket-main">
        <div className="ticket-label">
          {t('stat.sold')}
          <Delta trend={sold.trend} value={pct(sold.chipPct)} />
          <small>{t(sold.suffix)}</small>
        </div>
        <div className="hero-number">
          <Count value={sold.value} format={fmt} duration={1400} />
          <span>{t('hero.of', { n: fmt(CAPACITY) })}</span>
        </div>
        <div className="hero-bar" role="img" aria-label={t('hero.progress', { p: pct(share) })}>
          <span style={{ width: `${share}%` }} />
        </div>
        <div className="hero-foot">
          <span>{t('hero.capacity', { p: pct(share) })}</span>
          <span>{t('hero.updated', { d: total.suffixText, n: `+${fmt(total.chipCount)}` })}</span>
        </div>
      </div>
      <div className="ticket-stub">
        <span>{t('stat.available')}</span>
        <strong>
          <Count value={available.value} format={fmt} />
        </strong>
        <Delta trend={available.trend} value={pct(available.chipPct)} />
        <small>{t(available.suffix)}</small>
        <div className="barcode" aria-hidden="true" />
      </div>
    </section>
  );
}

function RevenueTile() {
  const { t, fmt, pct, money } = useI18n();
  const revenue = stat('revenue');
  return (
    <section className="card tile span-tile">
      <div className="tile-head">
        {t('stat.revenue')}
        <TileIcon icon={CircleDollarSign} color="var(--s-festival)" />
      </div>
      <div className="tile-value">
          <Count value={revenue.value} format={money} />
      </div>
      <div className="tile-note">
        <Delta trend={revenue.trend} value={pct(revenue.chipPct)} />
        {t(revenue.suffix)}
      </div>
      <Sparkline values={earningsMonthly.map((m) => m.revenue)} label={t('revenue.months')} />
    </section>
  );
}

function NextEventTile() {
  const { t, fmt, longDate } = useI18n();
  const next = events.filter((e) => e.date >= DEMO_TODAY).sort((a, b) => a.date.localeCompare(b.date))[0];
  return (
    <section className="card tile span-tile">
      <div className="tile-head">
        {t('next.title')}
        <TileIcon icon={Music2} color="var(--s-vip)" />
      </div>
      <div className="event-title">{next.name}</div>
      <div className="event-meta">
        <CalendarDays size={14} aria-hidden="true" />
        {longDate(new Date(`${next.date}T12:00:00`))} · {next.city}
      </div>
      <div className="progress" style={{ marginTop: 6 }} aria-hidden="true">
        <span style={{ width: `${(next.sold / next.capacity) * 100}%` }} />
      </div>
      <div className="event-count">{t('events.sold', { sold: fmt(next.sold), capacity: fmt(next.capacity) })}</div>
      <Link to="/admin/events" className="tile-link">
        {t('next.link')} <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </section>
  );
}

function SalesChart() {
  const { t } = useI18n();
  const [range, setRange] = useState('Weekly');
  const series = salesSeries.map((s) => ({ ...s, label: t(`series.${s.key}`), legend: t(`ticket.${s.key}`) }));
  const rows = salesData[range].rows.map((row) => ({ ...row, label: t(row.label) }));
  return (
    <section className="card chart-card span-chart">
      <div className="card-head">
        <div className="card-title">
          <TileIcon icon={ChartNoAxesColumn} color="var(--s-festival)" />
          <h2>{t('chart.title')}</h2>
        </div>
        <Seg
          label={t('chart.period')}
          value={range}
          onChange={setRange}
          options={Object.keys(salesData).map((value) => ({ value, label: t(`range.${value}`) }))}
        />
      </div>
      <StackedBars
        key={range}
        rows={rows}
        series={series}
        height={306}
        caption={t('chart.caption', { range: t(`range.${range}`).toLowerCase() })}
      />
    </section>
  );
}

function TypeSplit() {
  const { t, fmt, pct } = useI18n();
  const [active, setActive] = useState(null);
  const [ref, inView] = useInView();
  const total = ticketSegments.reduce((sum, s) => sum + s.value, 0);
  const dim = (key) => (active && active !== key ? ' is-dim' : '');
  const share = (value) => Math.round((value / total) * 1000) / 10;
  return (
    <section className="card chart-card">
      <div className="card-head">
        <div className="card-title">
          <TileIcon icon={PieChart} color="var(--s-gold)" />
          <h2>{t('split.title')}</h2>
        </div>
      </div>
      <div ref={ref} className={`split-bar${inView ? ' in' : ''}`} aria-hidden="true" onMouseLeave={() => setActive(null)}>
        {ticketSegments.map((s) => (
          <span
            key={s.key}
            className={dim(s.key).trim()}
            style={{ width: `${(s.value / total) * 100}%`, background: s.color }}
            title={`${t(`ticket.${s.key}`)} : ${fmt(s.value)}`}
            onMouseEnter={() => setActive(s.key)}
          />
        ))}
      </div>
      {ticketSegments.map((s) => (
        <div
          className={`split-row${dim(s.key)}`}
          key={s.key}
          onMouseEnter={() => setActive(s.key)}
          onMouseLeave={() => setActive(null)}
        >
          <i className="dot" style={{ background: s.color }} aria-hidden="true" />
          <span>{t(`ticket.${s.key}`)}</span>
          <b>
            <Count value={s.value} format={fmt} />
          </b>
          <small>{pct(share(s.value))}</small>
        </div>
      ))}
    </section>
  );
}

function PendingTile() {
  const { payouts } = useApp();
  const { t, money } = useI18n();
  const pending = payouts.filter((p) => p.status === 'Pending');
  const amount = pending.reduce((sum, p) => sum + p.amount, 0);
  return (
    <Link to="/admin/payouts" className="card pending-tile">
      <span className="pending-count">{pending.length}</span>
      <span className="pending-text">
        <strong>{t('pending.title')}</strong>
        <small>{t('pending.amount', { amount: money(amount) })}</small>
      </span>
      <ChevronRight size={18} aria-hidden="true" />
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useApp();
  const { t } = useI18n();
  return (
    <div className="dash">
      <PageIntro title={t('dash.hello', { name: user.name.split(' ')[0] })} subtitle={t('dash.subtitle')} />
      <div className="bento">
        <TicketHero />
        <RevenueTile />
        <NextEventTile />
        <SalesChart />
        <div className="span-side">
          <TypeSplit />
          <PendingTile />
        </div>
      </div>
      <BuyersTable />
    </div>
  );
}
