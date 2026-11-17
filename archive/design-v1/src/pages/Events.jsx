import { useState } from 'react';
import { CalendarDays, MapPin, Music2, Search } from 'lucide-react';
import { events } from '../data.js';
import { useI18n } from '../i18n.jsx';
import { PageIntro, StatusBadge } from '../components/ui.jsx';

const TABS = ['All', 'Selling', 'Sold out', 'Ended'];

export default function Events() {
  const { t, fmt, longDate } = useI18n();
  const [tab, setTab] = useState('All');
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const visible = events.filter(
    (e) => (tab === 'All' || e.status === tab) && (!q || `${e.name} ${e.city} ${e.venue}`.toLowerCase().includes(q)),
  );

  return (
    <div className="page">
      <PageIntro title={t('nav.events')} subtitle={t('events.subtitle')} />
      <div className="toolbar">
        <div className="tabs" role="group" aria-label={t('events.filterAria')}>
          {TABS.map((name) => (
            <button type="button" key={name} className={name === tab ? 'on' : ''} aria-pressed={name === tab} onClick={() => setTab(name)}>
              {name === 'All' ? t('events.all') : t(`status.${name}`)}
            </button>
          ))}
        </div>
        <label className="search">
          <Search size={14} aria-hidden="true" />
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
        {visible.map((e) => (
          <article className="card event-card" key={e.id}>
            <div
              className="event-cover"
              style={{ background: `linear-gradient(135deg, hsl(${e.hue} 68% 36%), hsl(${e.hue + 45} 68% 48%))` }}
            >
              <Music2 size={22} aria-hidden="true" />
              <StatusBadge status={e.status} />
            </div>
            <div className="event-body">
              <h3>{e.name}</h3>
              <span className="event-meta">
                <CalendarDays size={14} aria-hidden="true" /> {longDate(new Date(`${e.date}T12:00:00`))}
              </span>
              <span className="event-meta">
                <MapPin size={14} aria-hidden="true" /> {e.venue}, {e.city}
              </span>
              <div className="progress" aria-hidden="true">
                <span style={{ width: `${(e.sold / e.capacity) * 100}%` }} />
              </div>
              <span className="event-count">{t('events.sold', { sold: fmt(e.sold), capacity: fmt(e.capacity) })}</span>
            </div>
          </article>
        ))}
      </div>
      {visible.length === 0 && <p className="card empty">{t('events.empty')}</p>}
    </div>
  );
}
