import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  BadgePercent,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Contact,
  Headset,
  LayoutGrid,
  LogOut,
  Menu,
  Music2,
  Settings as SettingsIcon,
  Ticket,
  X,
} from 'lucide-react';
import { BRAND } from '../data.js';
import { useApp } from '../context.jsx';
import { useI18n } from '../i18n.jsx';
import { LangSwitch, Popover } from './ui.jsx';

const GENERAL = [
  { to: '/', label: 'nav.dashboard', icon: LayoutGrid, end: true },
  { to: '/ticket-sales', label: 'nav.ticketSales', icon: Ticket },
  { to: '/events', label: 'nav.events', icon: Music2 },
  { to: '/payouts', label: 'nav.payouts', icon: Contact },
  { to: '/earnings', label: 'nav.earnings', icon: CircleDollarSign },
  { to: '/calendar', label: 'nav.calendar', icon: CalendarDays },
  { to: '/promotions', label: 'nav.promotions', icon: BadgePercent },
  { to: '/help', label: 'nav.help', icon: Headset },
];

const TITLES = {
  '/': 'nav.dashboard',
  '/ticket-sales': 'nav.ticketSales',
  '/events': 'nav.events',
  '/payouts': 'nav.payouts',
  '/earnings': 'nav.earnings',
  '/calendar': 'nav.calendar',
  '/promotions': 'nav.promotions',
  '/help': 'nav.help',
  '/settings': 'nav.settings',
};

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function NavItem({ item, onNavigate }) {
  const { t } = useI18n();
  const Icon = item.icon;
  return (
    <NavLink to={item.to} end={item.end} className="nav-item" onClick={onNavigate}>
      <Icon size={19} strokeWidth={1.7} />
      <span>{t(item.label)}</span>
    </NavLink>
  );
}

function Notifications() {
  const { notifications, setNotifications } = useApp();
  const { t } = useI18n();
  return (
    <Popover
      trigger={({ open, toggle }) => (
        <button
          type="button"
          className="icon-btn bell"
          aria-expanded={open}
          aria-label={t('notif.aria', { n: notifications.length })}
          onClick={toggle}
        >
          <Bell size={24} strokeWidth={1.6} />
          {notifications.length > 0 && <b>{notifications.length}</b>}
        </button>
      )}
    >
      {(close) => (
        <div className="notif-menu">
          <div className="notif-head">
            <strong>{t('notif.title')}</strong>
            {notifications.length > 0 && (
              <button type="button" className="link-btn" onClick={() => setNotifications([])}>
                {t('notif.markAll')}
              </button>
            )}
          </div>
          {notifications.length === 0 && <p className="empty">{t('notif.empty')}</p>}
          {notifications.map((n) => (
            <Link
              key={n.id}
              to={n.to}
              className="notif-item"
              onClick={() => {
                setNotifications((list) => list.filter((x) => x.id !== n.id));
                close();
              }}
            >
              <span>{t(n.title)}</span>
              <small>{t(n.time)}</small>
            </Link>
          ))}
        </div>
      )}
    </Popover>
  );
}

export default function Layout() {
  const { user, toast } = useApp();
  const { t, lang } = useI18n();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const scrollRef = useRef(null);
  const closeDrawer = () => setDrawer(false);
  const title = t(TITLES[pathname] ?? 'nav.dashboard');

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.title = `${title} · ${BRAND}`;
  }, [title, lang]);

  return (
    <div className="stage">
      <div className="shell">
        {drawer && <button type="button" className="scrim" aria-label={t('nav.close')} onClick={closeDrawer} />}
        <aside className={`sidebar${drawer ? ' open' : ''}`}>
          <div className="brand-row">
            <Link to="/" className="brand" onClick={closeDrawer}>
              {BRAND}
            </Link>
            <button type="button" className="icon-btn drawer-close" aria-label={t('nav.close')} onClick={closeDrawer}>
              <X size={22} />
            </button>
          </div>
          <nav aria-label={t('nav.main')}>
            <p className="nav-label">{t('nav.general')}</p>
            {GENERAL.map((item) => (
              <NavItem key={item.to} item={item} onNavigate={closeDrawer} />
            ))}
            <hr />
            <p className="nav-label">{t('nav.others')}</p>
            <NavItem item={{ to: '/settings', label: 'nav.settings', icon: SettingsIcon }} onNavigate={closeDrawer} />
            <button type="button" className="nav-item" onClick={() => navigate('/login')}>
              <LogOut size={19} strokeWidth={1.7} />
              <span>{t('nav.logout')}</span>
            </button>
          </nav>
        </aside>

        <div className="main">
          <header className="topbar">
            <button type="button" className="icon-btn hamburger" aria-label={t('nav.open')} onClick={() => setDrawer(true)}>
              <Menu size={24} />
            </button>
            <h1>{title}</h1>
            <div className="topbar-right">
              <LangSwitch />
              <Notifications />
              <Popover
                trigger={({ open, toggle }) => (
                  <button type="button" className="profile" aria-expanded={open} onClick={toggle}>
                    <span className="avatar" aria-hidden="true">
                      {initials(user.name)}
                    </span>
                    <span className="profile-text">
                      <strong>{user.name}</strong>
                      <small>{t(`role.${user.role}`)}</small>
                    </span>
                    <ChevronDown size={18} className="profile-chevron" />
                  </button>
                )}
              >
                {(close) => (
                  <>
                    <Link to="/settings" className="menu-item" onClick={close}>
                      {t('account.settings')}
                    </Link>
                    <Link to="/login" className="menu-item" onClick={close}>
                      {t('nav.logout')}
                    </Link>
                  </>
                )}
              </Popover>
            </div>
          </header>
          <main className="content" ref={scrollRef}>
            <Outlet />
          </main>
        </div>
      </div>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
