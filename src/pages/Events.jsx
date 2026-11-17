import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { events } from '../data.js';
import { useI18n } from '../i18n.jsx';
import { PageIntro, Seg, StatusBadge } from '../components/ui.jsx';

const TABS = ['All', 'Selling', 'Sold out', 'Ended'];

export default function Events() {
  const { t, fmt, locale } = useI18n();
  const { state } = useLocation();
  const [tab, setTab] = useState('All');
  const [query, setQuery] = useState(state?.q ?? '');
  const q = query.trim().toLowerCase();
  const visible = events.filter(
    (e) => (tab === 'All' || e.status === tab) && (!q || `${e.name} ${e.city} ${e.venue}`.toLowerCase().includes(q)),
  );

  return (
    <div className="page">
      <PageIntro title={t('nav.events')} subtitle={t('events.subtitle')} />
      <div className="toolbar">
        <Seg
          label={t('events.filterAria')}
          value={tab}
          onChange={setTab}
          options={TABS.map((name) => ({ value: name, label: name === 'All' ? t('events.all') : t(`status.${name}`) }))}
        />
        <label className="search">
          <Search size={15} aria-hidden="true" />
          <input
            type="search"
            aria-label={t('events.search')}
            placeholder={t('events.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="event-grid">
        {visible.map((e) => {
          const date = new Date(`${e.date}T12:00:00`);
          return (
            <article className="card event-card" key={e.id}>
              <div className="event-stub" style={{ '--h': e.hue }}>
                <b>{date.getDate()}</b>
                <span>{date.toLocaleDateString(locale, { month: 'short' })}</span>
                <small>{date.getFullYear()}</small>
              </div>
              <div className="event-body">
                <div className="event-body-top">
                  <h3>{e.name}</h3>
                  <StatusBadge status={e.status} />
                </div>
                <span className="event-meta">
                  <MapPin size={14} aria-hidden="true" /> {e.venue}, {e.city}
                </span>
                <div className="progress" aria-hidden="true">
                  <span style={{ width: `${(e.sold / e.capacity) * 100}%` }} />
                </div>
                <span className="event-count">{t('events.sold', { sold: fmt(e.sold), capacity: fmt(e.capacity) })}</span>
              </div>
            </article>
          );
        })}
      </div>
      {visible.length === 0 && <p className="card empty">{t('events.empty')}</p>}
    </div>
  );
}
