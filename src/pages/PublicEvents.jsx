import { ArrowRight, CalendarDays, MapPin, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { events, ticketOffers } from '../data.js';
import { useI18n } from '../i18n.jsx';

export default function PublicEvents() {
  const { money, longDate } = useI18n();
  const upcoming = events.filter((event) => event.date >= '2026-11-17');
  return (
    <div className="public-listing">
      <div className="public-page-intro"><span className="eyebrow">HÔTEL 2 FÉVRIER · LOMÉ</span><h1>La programmation</h1><p>Des expériences uniques, dans un lieu d’exception.</p></div>
      <div className="listing-count"><Ticket size={15} /> {upcoming.length} événements à venir</div>
      <div className="public-event-grid listing-grid">
        {upcoming.map((event, index) => {
          const offer = ticketOffers[event.id]?.[0];
          return <article className={`public-event-card event-tone-${(index % 3) + 1}`} key={event.id}>
            <div className="public-event-art"><span className="event-date-chip"><CalendarDays size={14} />{longDate(new Date(`${event.date}T12:00:00`))}</span><span className="event-art-index">{String(index + 1).padStart(2, '0')}</span></div>
            <div className="public-event-info"><span className="event-place"><MapPin size={13} /> {event.venue}</span><h3>{event.name}</h3>
              <div className="public-event-bottom"><span>Dès <b>{money(offer.price)}</b></span><Link to={`/events/${event.id}`} aria-label={`Voir ${event.name}`}><ArrowRight size={17} /></Link></div>
            </div>
          </article>;
        })}
      </div>
      {upcoming.length === 0 && <p className="empty">La prochaine programmation sera bientôt annoncée.</p>}
    </div>
  );
}
