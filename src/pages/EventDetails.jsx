import { ArrowLeft, ArrowRight, CalendarDays, MapPin, ShieldCheck, Ticket } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { events, ticketOffers } from '../data.js';
import { useI18n } from '../i18n.jsx';

export default function EventDetails() {
  const { eventId } = useParams();
  const event = events.find((item) => String(item.id) === eventId);
  const { money, longDate } = useI18n();
  if (!event || event.date < '2026-11-17') return <Navigate to="/events" replace />;
  return <div className="event-detail-page">
    <Link to="/events" className="back-link"><ArrowLeft size={15} /> Tous les événements</Link>
    <div className="event-detail-hero"><div className="event-detail-art"><span className="eyebrow">HÔTEL 2 FÉVRIER · LOMÉ</span><Ticket size={58} strokeWidth={1} /><span>UNE SOIRÉE SIGNATURE</span></div>
      <div className="event-detail-copy"><span className="eyebrow">ÉVÉNEMENT À VENIR</span><h1>{event.name}</h1><p>Une expérience mémorable dans le cadre raffiné de l’Hôtel 2 Février.</p>
        <div className="event-detail-meta"><span><CalendarDays size={17} />{longDate(new Date(`${event.date}T12:00:00`))}</span><span><MapPin size={17} />{event.venue}</span></div>
        <a href="#billets" className="btn btn-gold">Choisir mes billets <ArrowRight size={16} /></a>
      </div>
    </div>
    <div className="ticket-offer-section" id="billets"><div className="offer-section-title"><div><span className="eyebrow">RÉSERVATION</span><h2>Choisissez votre expérience</h2></div><span className="secure-note"><ShieldCheck size={16} /> Réservation sécurisée</span></div>
      <div className="ticket-offer-list">{(ticketOffers[event.id] ?? []).map((offer) => <article className="ticket-offer" key={offer.type}><span className={`offer-icon offer-${offer.type.split(' ')[0].toLowerCase()}`}><Ticket size={19} /></span><div className="offer-main"><h3>{offer.type.replace(' Ticket', '')}</h3><p>{offer.label}</p></div><b className="offer-price">{money(offer.price)}</b><Link className="btn offer-button" to={`/checkout/${event.id}?ticket=${encodeURIComponent(offer.type)}`}>Réserver <ArrowRight size={15} /></Link></article>)}</div>
      <p className="demo-payment-note">Les tarifs et disponibilités affichés sont des données de démonstration. Le paiement en ligne sera activé après connexion d’un prestataire.</p>
    </div>
  </div>;
}
