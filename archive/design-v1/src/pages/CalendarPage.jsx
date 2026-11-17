import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { events } from '../data.js';
import { useI18n } from '../i18n.jsx';
import { PageIntro } from '../components/ui.jsx';

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const pad = (n) => String(n).padStart(2, '0');

export default function CalendarPage() {
  const { t, dayLabel, monthYear } = useI18n();
  const [view, setView] = useState({ year: 2025, month: 0 });
  const [selected, setSelected] = useState('2025-01-25');

  const first = new Date(view.year, view.month, 1);
  const blanks = (first.getDay() + 6) % 7;
  const days = new Date(view.year, view.month + 1, 0).getDate();
  const iso = (day) => `${view.year}-${pad(view.month + 1)}-${pad(day)}`;
  const move = (delta) => {
    const next = new Date(view.year, view.month + delta, 1);
    setView({ year: next.getFullYear(), month: next.getMonth() });
  };

  const agenda = events.filter((e) => e.date === selected);

  return (
    <div className="page">
      <PageIntro title={t('nav.calendar')} subtitle={t('calendar.subtitle')} />
      <div className="calendar-layout">
        <section className="card panel">
          <div className="cal-head">
            <button type="button" className="icon-btn" aria-label={t('calendar.prev')} onClick={() => move(-1)}>
              <ChevronLeft size={20} />
            </button>
            <strong>{monthYear(first)}</strong>
            <button type="button" className="icon-btn" aria-label={t('calendar.next')} onClick={() => move(1)}>
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="cal-grid">
            {DOW.map((d) => (
              <div key={d} className="cal-dow">
                {t(`day.${d}`)}
              </div>
            ))}
            {Array.from({ length: blanks }, (_, i) => (
              <div key={`blank-${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const day = i + 1;
              const date = iso(day);
              const dayEvents = events.filter((e) => e.date === date);
              return (
                <button
                  type="button"
                  key={date}
                  className={`cal-day${selected === date ? ' selected' : ''}`}
                  aria-pressed={selected === date}
                  onClick={() => setSelected(date)}
                >
                  <span>{day}</span>
                  {dayEvents.map((e) => (
                    <span className="cal-pill" key={e.id}>
                      {e.name}
                    </span>
                  ))}
                </button>
              );
            })}
          </div>
        </section>
        <aside className="card panel">
          <h3>{dayLabel(new Date(`${selected}T12:00:00`))}</h3>
          {agenda.length === 0 && <p className="empty">{t('calendar.empty')}</p>}
          {agenda.map((e) => (
            <div className="agenda-item" key={e.id}>
              <strong>{e.name}</strong>
              <small>
                {e.venue}, {e.city}
              </small>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
