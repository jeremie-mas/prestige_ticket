import { Link, NavLink, Outlet } from 'react-router-dom';
import { ArrowUpRight, Ticket } from 'lucide-react';
import { BRAND } from '../data.js';

export default function PublicLayout() {
  return (
    <div className="public-site">
      <header className="public-header">
        <Link to="/" className="public-brand">
          <span className="brand-mark"><Ticket size={18} /></span>
          <span><strong>{BRAND}</strong><small>Hôtel 2 Février · Lomé</small></span>
        </Link>
        <nav className="public-nav" aria-label="Navigation principale">
          <NavLink to="/events">Événements</NavLink>
          <a href="/#hotel">L’hôtel</a>
        </nav>
        <Link className="btn public-admin-link" to="/admin">Espace gestion <ArrowUpRight size={15} /></Link>
      </header>
      <main className="public-main"><Outlet /></main>
      <footer className="public-footer">
        <Link to="/" className="public-brand"><span className="brand-mark"><Ticket size={16} /></span><strong>{BRAND}</strong></Link>
        <span>Événements & billetterie · Hôtel 2 Février, Lomé</span>
        <Link to="/admin">Accès administration</Link>
      </footer>
    </div>
  );
}
