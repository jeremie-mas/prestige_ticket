import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  BadgePercent,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Contact,
  Headset,
  LayoutGrid,
  LogOut,
  Menu,
  Moon,
  Music2,
  PanelLeftClose,
  PanelLeftOpen,
  Settings as SettingsIcon,
  Sun,
  Ticket,
  X,
} from 'lucide-react';
import { BRAND } from '../data.js';
import { useApp } from '../context.jsx';
import { useI18n } from '../i18n.jsx';
import { useTheme } from '../theme.jsx';
import { useThumb } from '../motion.jsx';
import CommandPalette from './CommandPalette.jsx';
import { LangSwitch, Popover } from './ui.jsx';

const RAIL_KEY = 'tickets-rail';

const GENERAL = [
  { to: '/admin', label: 'nav.dashboard', icon: LayoutGrid, end: true },
  { to: '/admin/ticket-sales', label: 'nav.ticketSales', icon: Ticket },
  { to: '/admin/events', label: 'nav.events', icon: Music2 },
  { to: '/admin/payouts', label: 'nav.payouts', icon: Contact },
  { to: '/admin/earnings', label: 'nav.earnings', icon: CircleDollarSign },
  { to: '/admin/calendar', label: 'nav.calendar', icon: CalendarDays },
  { to: '/admin/promotions', label: 'nav.promotions', icon: BadgePercent },
  { to: '/admin/help', label: 'nav.help', icon: Headset },
];

const SETTINGS = { to: '/admin/settings', label: 'nav.settings', icon: SettingsIcon };
const ALL_PAGES = [...GENERAL, SETTINGS];

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function readRail() {
  try {
    return localStorage.getItem(RAIL_KEY) === '1';
  } catch {
    return false;
  }
}

function NavItem({ item, onNavigate }) {
  const { t } = useI18n();
  const Icon = item.icon;
  return (
    <NavLink to={item.to} end={item.end} className="nav-item" title={t(item.label)} onClick={onNavigate}>
      <Icon size={18} strokeWidth={1.8} />
      <span>{t(item.label)}</span>
    </NavLink>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const label = t(theme === 'dark' ? 'theme.toLight' : 'theme.toDark');
  return (
    <button type="button" className="icon-btn boxed" aria-label={label} title={label} onClick={toggleTheme}>
      <span className="theme-icon" key={theme}>
        {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      </span>
    </button>
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
          className="icon-btn boxed bell"
          aria-expanded={open}
          aria-label={t('notif.aria', { n: notifications.length })}
          onClick={toggle}
        >
          <Bell size={17} />
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
  const { t } = useI18n();
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const [rail, setRail] = useState(readRail);
  const scrollRef = useRef(null);
  const [navRef, navThumb] = useThumb('.nav-item.active');
  const closeDrawer = () => setDrawer(false);
  const current = ALL_PAGES.find((p) => p.to === pathname);
  const title = t(current?.label ?? 'nav.dashboard');

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.title = `${title} · ${BRAND}`;
  }, [title]);

  const toggleRail = () => {
    const next = !rail;
    setRail(next);
    try {
      localStorage.setItem(RAIL_KEY, next ? '1' : '0');
    } catch {
      // Le choix reste valable jusqu'au rechargement.
    }
  };

  const railLabel = t(rail ? 'nav.expand' : 'nav.collapse');

  return (
    <div className={`app${rail ? ' rail' : ''}`}>
      {drawer && <button type="button" className="scrim" aria-label={t('nav.close')} onClick={closeDrawer} />}
      <aside className={`sidebar${drawer ? ' open' : ''}`}>
        <div className="brand-row">
          <Link to="/admin" className="brand" aria-label={BRAND} onClick={closeDrawer}>
            <span className="brand-mark" aria-hidden="true">
              <Ticket size={18} />
            </span>
            <span className="brand-name">{BRAND}</span>
          </Link>
          <button type="button" className="icon-btn drawer-close" aria-label={t('nav.close')} onClick={closeDrawer}>
            <X size={20} />
          </button>
        </div>
        <nav aria-label={t('nav.main')} ref={navRef}>
          {navThumb && <span className="nav-thumb" style={navThumb} aria-hidden="true" />}
          <div className="nav-group">
            <p className="nav-label">{t('nav.general')}</p>
            {GENERAL.map((item) => (
              <NavItem key={item.to} item={item} onNavigate={closeDrawer} />
            ))}
          </div>
          <div className="nav-group">
            <p className="nav-label">{t('nav.others')}</p>
            <NavItem item={SETTINGS} onNavigate={closeDrawer} />
            <button type="button" className="nav-item" title={t('nav.logout')} onClick={() => navigate('/')}>
              <LogOut size={18} strokeWidth={1.8} />
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        </nav>
        <div className="side-foot">
          <button type="button" className="nav-item" title={railLabel} aria-label={railLabel} onClick={toggleRail}>
            {rail ? <PanelLeftOpen size={18} strokeWidth={1.8} /> : <PanelLeftClose size={18} strokeWidth={1.8} />}
            <span>{railLabel}</span>
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button type="button" className="icon-btn boxed hamburger" aria-label={t('nav.open')} onClick={() => setDrawer(true)}>
            <Menu size={19} />
          </button>
          <CommandPalette pages={ALL_PAGES} />
          <div className="topbar-right">
            <LangSwitch />
            <ThemeToggle />
            <Notifications />
            <Popover
              trigger={({ open, toggle }) => (
                <button type="button" className="profile" aria-expanded={open} aria-label={user.name} onClick={toggle}>
                  <span className="avatar" aria-hidden="true">
                    {initials(user.name)}
                  </span>
                  <span className="profile-text">
                    <strong>{user.name}</strong>
                    <small>{t(`role.${user.role}`)}</small>
                  </span>
                  <ChevronDown size={15} />
                </button>
              )}
            >
              {(close) => (
                <>
                  <Link to="/admin/settings" className="menu-item" onClick={close}>
                    {t('account.settings')}
                  </Link>
                  <Link to="/" className="menu-item" onClick={close}>
                    {t('nav.logout')}
                  </Link>
                </>
              )}
            </Popover>
          </div>
        </header>
        <main className="content" ref={scrollRef}>
          <div className="page-anim" key={location.key}>
            <Outlet />
          </div>
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          <Check size={16} aria-hidden="true" />
          {toast}
        </div>
      )}
    </div>
  );
}
