import { ArrowRight, CalendarDays, Check, Mail, MapPin, Ticket } from 'lucide-react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n.jsx';

export default function OrderConfirmation() {
  const { state } = useLocation();
  const { money, longDate } = useI18n();
  const order = state?.order;
  if (!order) return <Navigate to="/events" replace />;
  return <div className="confirmation-page"><div className="confirmation-card"><span className="confirmation-check"><Check size={25} /></span><span className="eyebrow">DEMANDE ENREGISTRÉE</span><h1>Merci, {order.name.split(' ')[0]}.</h1><p>Votre demande de réservation a bien été prise en compte dans cette démonstration.</p>
    <div className="confirmation-ref"><span>Référence de réservation</span><b>{order.id}</b></div>
    <div className="confirmation-details"><div><Ticket size={17} /><span><b>{order.event}</b><small>{order.ticket.replace(' Ticket', '')} · {order.quantity} billet{order.quantity > 1 ? 's' : ''}</small></span></div><div><CalendarDays size={17} /><span>{longDate(new Date(`${order.eventDate}T12:00:00`))}</span></div><div><MapPin size={17} /><span>{order.venue}</span></div><div><Mail size={17} /><span>Confirmation destinée à {order.email}</span></div></div>
    <div className="confirmation-total"><span>Montant indicatif</span><b>{money(order.total)}</b></div><p className="confirmation-demo-note">Aucun paiement réel n’a été effectué. Cette réservation de démonstration n’est pas un billet d’accès.</p>
    <Link to="/events" className="btn btn-gold">Voir les autres événements <ArrowRight size={16} /></Link>
  </div></div>;
}
