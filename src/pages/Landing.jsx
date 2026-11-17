import { ArrowDown, ArrowRight, CalendarDays, MapPin, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { events, ticketOffers } from '../data.js';
import { useI18n } from '../i18n.jsx';

export default function Landing() {
  const { money, longDate } = useI18n();
  const upcoming = events.filter((event) => event.date >= '2026-11-17').slice(0, 3);
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <span className="eyebrow"><i /> L’ART DE RECEVOIR, AU CŒUR DE LOMÉ</span>
          <h1>Les grands moments<br />se vivent <em>ensemble.</em></h1>
          <p>Découvrez les événements de l’Hôtel 2 Février et réservez votre place en quelques instants.</p>
          <div className="landing-actions">
            <Link to="/events" className="btn btn-gold">Découvrir les événements <ArrowRight size={16} /></Link>
            <a className="text-link" href="#programmation">Voir la programmation <ArrowDown size={15} /></a>
          </div>
          <div className="hero-location"><MapPin size={15} /> Hôtel 2 Février, Lomé · Togo</div>
        </div>
        <div className="hero-art" aria-label="Événement de gala à l’Hôtel 2 Février">
          <div className="hero-art-glow" />
          <div className="hero-art-label"><span>PRESTIGE</span><small>Une adresse, mille émotions</small></div>
          <div className="hero-art-card"><Ticket size={17} /><span>Vivez l’instant</span><b>LOMÉ · TOGO</b></div>
        </div>
        <a className="scroll-cue" href="#programmation"><span>Explorer</span><ArrowDown size={14} /></a>
      </section>

      <section className="public-section" id="programmation">
        <div className="public-section-head">
          <div><span className="eyebrow">À VENIR À L’HÔTEL</span><h2>Les prochains rendez-vous</h2></div>
          <Link to="/events" className="text-link">Toute la programmation <ArrowRight size={15} /></Link>
        </div>
        <div className="public-event-grid">
          {upcoming.map((event, index) => {
            const offer = ticketOffers[event.id]?.[0];
            return (
              <article className={`public-event-card event-tone-${index + 1}`} key={event.id}>
                <div className="public-event-art"><span className="event-date-chip"><CalendarDays size={14} />{longDate(new Date(`${event.date}T12:00:00`))}</span><span className="event-art-index">0{index + 1}</span></div>
                <div className="public-event-info">
                  <span className="event-place"><MapPin size={13} /> {event.venue.replace('Hôtel 2 Février · ', '')}</span>
                  <h3>{event.name}</h3>
                  <div className="public-event-bottom"><span>Dès <b>{money(offer.price)}</b></span><Link to={`/events/${event.id}`} aria-label={`Voir ${event.name}`}><ArrowRight size={17} /></Link></div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="hotel-band" id="hotel">
        <div className="hotel-band-mark"><span>02</span><i /></div>
        <div><span className="eyebrow">L’ADRESSE DES GRANDS MOMENTS</span><h2>Une expérience à la hauteur<br />de vos plus belles occasions.</h2></div>
        <p>Gala, dîner, rencontre ou célébration : retrouvez ici les rendez-vous organisés dans le cadre prestigieux de l’Hôtel 2 Février.</p>
      </section>
      <section className="public-cta"><div><span className="eyebrow">VOTRE PROCHAIN SOUVENIR</span><h2>On se retrouve à l’Hôtel ?</h2></div><Link to="/events" className="btn btn-gold">Choisir un événement <ArrowRight size={16} /></Link></section>
    </div>
  );
}
