import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CreditCard, ShieldCheck, Ticket } from 'lucide-react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { events, ticketOffers } from '../data.js';
import { useI18n } from '../i18n.jsx';

export default function Checkout() {
  const { eventId } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const event = events.find((item) => String(item.id) === eventId);
  const offers = ticketOffers[eventId] ?? [];
  const [offerType, setOfferType] = useState(search.get('ticket') ?? offers[0]?.type);
  const [quantity, setQuantity] = useState(1);
  const { money, longDate } = useI18n();
  if (!event || event.date < '2026-11-17' || !offers.length) return <Navigate to="/events" replace />;
  const offer = offers.find((item) => item.type === offerType) ?? offers[0];
  const total = offer.price * quantity;
  const submit = (formEvent) => {
    formEvent.preventDefault();
    const form = new FormData(formEvent.currentTarget);
    const order = { id: `PE-${Date.now().toString().slice(-7)}`, event: event.name, eventDate: event.date, venue: event.venue, ticket: offer.type, quantity, total, name: form.get('name'), email: form.get('email'), phone: form.get('phone') };
    navigate('/order-confirmation', { state: { order } });
  };
  return <div className="checkout-page"><Link to={`/events/${event.id}`} className="back-link"><ArrowLeft size={15} /> Retour à l’événement</Link>
    <div className="checkout-heading"><span className="eyebrow">FINALISER LA RÉSERVATION</span><h1>Vos billets vous attendent.</h1><p>{event.name} · {longDate(new Date(`${event.date}T12:00:00`))}</p></div>
    <div className="checkout-layout"><form className="checkout-form" onSubmit={submit}>
      <section className="checkout-block"><div className="checkout-block-title"><span>01</span><div><h2>Choisissez vos billets</h2><p>Type et quantité souhaités</p></div></div>
        <label className="field-label" htmlFor="ticket-type">Type de billet</label><select id="ticket-type" value={offerType} onChange={(eventChange) => setOfferType(eventChange.target.value)}>{offers.map((item) => <option key={item.type} value={item.type}>{item.type.replace(' Ticket', '')} — {money(item.price)}</option>)}</select>
        <label className="field-label quantity-label" htmlFor="ticket-quantity">Quantité</label><select id="ticket-quantity" value={quantity} onChange={(eventChange) => setQuantity(Number(eventChange.target.value))}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'billet' : 'billets'}</option>)}</select>
      </section>
      <section className="checkout-block"><div className="checkout-block-title"><span>02</span><div><h2>Vos coordonnées</h2><p>Pour recevoir la confirmation de réservation</p></div></div>
        <div className="checkout-fields"><label>Nom complet<input name="name" autoComplete="name" required placeholder="Votre nom et prénom" /></label><label>E-mail<input name="email" type="email" autoComplete="email" required placeholder="vous@exemple.com" /></label><label>Téléphone<input name="phone" type="tel" autoComplete="tel" required placeholder="+228 90 00 00 00" /></label></div>
      </section>
      <section className="checkout-block"><div className="checkout-block-title"><span>03</span><div><h2>Mode de paiement</h2><p>Le paiement sera disponible à l’ouverture de la billetterie en ligne.</p></div></div><div className="payment-placeholder"><CreditCard size={20} /><span><b>Paiement en ligne</b><small>Mobile Money et carte bancaire</small></span><span className="payment-soon">Bientôt disponible</span></div></section>
      <button className="btn btn-gold checkout-submit" type="submit"><Check size={16} /> Confirmer la demande de réservation <ArrowRight size={16} /></button>
      <p className="checkout-demo-note"><ShieldCheck size={14} /> Démonstration : cette demande ne déclenche aucun paiement réel.</p>
    </form>
    <aside className="order-summary"><span className="eyebrow">RÉCAPITULATIF</span><div className="summary-event"><span className="summary-ticket"><Ticket size={20} /></span><div><b>{event.name}</b><small>{event.venue}</small></div></div><div className="summary-line"><span>{offer.type.replace(' Ticket', '')} × {quantity}</span><b>{money(total)}</b></div><div className="summary-line"><span>Frais de réservation</span><b>Inclus</b></div><div className="summary-total"><span>Total</span><b>{money(total)}</b></div><p>Les prix sont affichés en FCFA (XOF).</p></aside></div>
  </div>;
}
