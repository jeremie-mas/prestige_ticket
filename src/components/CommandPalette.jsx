import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, CornerDownLeft, Search, Ticket, UserRound } from 'lucide-react';
import { buyers, events } from '../data.js';
import { useI18n } from '../i18n.jsx';

export default function CommandPalette({ pages }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);
  const openerRef = useRef(null);
  const listRef = useRef(null);

  const show = () => {
    openerRef.current = document.activeElement;
    setQuery('');
    setIndex(0);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    openerRef.current?.focus?.();
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (!open) show();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (...fields) => !q || fields.some((f) => f.toLowerCase().includes(q));
    const result = [];

    const pageItems = pages
      .filter((p) => match(t(p.label)))
      .map((p) => ({ id: `page-${p.to}`, label: t(p.label), icon: p.icon, go: () => navigate(p.to) }));
    if (pageItems.length) result.push({ title: t('cmd.pages'), items: pageItems });

    if (q) {
      const eventItems = events
        .filter((e) => match(e.name, e.city, e.venue))
        .slice(0, 4)
        .map((e) => ({
          id: `event-${e.id}`,
          label: e.name,
          hint: e.city,
          icon: CalendarDays,
          go: () => navigate('/admin/events', { state: { q: e.name } }),
        }));
      if (eventItems.length) result.push({ title: t('cmd.events'), items: eventItems });
    }

    if (q.length >= 2) {
      const buyerItems = buyers
        .filter((b) => match(b.id, b.name, b.email))
        .slice(0, 5)
        .map((b) => ({
          id: `buyer-${b.id}`,
          label: b.name,
          hint: b.id,
          icon: UserRound,
          // Passé par l'état de navigation pour ne pas mettre ces données dans l'URL.
          go: () => navigate('/admin/ticket-sales', { state: { q: b.id, month: b.month } }),
        }));
      if (buyerItems.length) result.push({ title: t('cmd.buyers'), items: buyerItems });
    }
    return result;
  }, [query, pages, t, navigate]);

  const flat = groups.flatMap((g) => g.items);
  const current = Math.min(index, Math.max(flat.length - 1, 0));

  const choose = (item) => {
    setOpen(false);
    item.go();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!flat.length) return;
      const delta = e.key === 'ArrowDown' ? 1 : -1;
      const next = (current + delta + flat.length) % flat.length;
      setIndex(next);
      listRef.current?.querySelector(`[data-index="${next}"]`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flat[current]) choose(flat[current]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      // La recherche garde le focus tant qu'elle est ouverte.
      e.preventDefault();
    }
  };

  const isMac = /mac/i.test(navigator.platform ?? '');
  let running = -1;

  return (
    <>
      <button type="button" className="cmd-btn" aria-label={t('cmd.label')} onClick={show}>
        <Search size={16} aria-hidden="true" />
        <span>{t('cmd.search')}</span>
        <kbd>{isMac ? '⌘ K' : 'Ctrl K'}</kbd>
      </button>
      {open && (
        <div
          className="cmd-scrim"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="cmd" role="dialog" aria-modal="true" aria-label={t('cmd.label')}>
            <label className="cmd-input">
              <Search size={18} aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="cmd-list"
                aria-activedescendant={flat[current] ? `cmd-${flat[current].id}` : undefined}
                aria-label={t('cmd.label')}
                placeholder={t('cmd.placeholder')}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                onKeyDown={onKeyDown}
              />
              <kbd>Esc</kbd>
            </label>
            <div className="cmd-list" id="cmd-list" role="listbox" ref={listRef}>
              {flat.length === 0 && <p className="empty">{t('cmd.empty')}</p>}
              {groups.map((group) => (
                <div key={group.title} role="group" aria-label={group.title}>
                  <p className="cmd-group">{group.title}</p>
                  {group.items.map((item) => {
                    running += 1;
                    const i = running;
                    const Icon = item.icon ?? Ticket;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        id={`cmd-${item.id}`}
                        role="option"
                        tabIndex={-1}
                        aria-selected={i === current}
                        data-index={i}
                        className={`cmd-item${i === current ? ' on' : ''}`}
                        onMouseMove={() => setIndex(i)}
                        onClick={() => choose(item)}
                      >
                        <Icon size={16} aria-hidden="true" />
                        <span>{item.label}</span>
                        {item.hint ? <small>{item.hint}</small> : i === current && <small><CornerDownLeft size={13} aria-hidden="true" /></small>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
