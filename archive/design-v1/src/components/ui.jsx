import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n.jsx';

export function Popover({ trigger, children, align = 'right', up = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  return (
    <div className="popover" ref={ref}>
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open && (
        <div className={`menu menu-${align}${up ? ' menu-up' : ''}`}>
          {typeof children === 'function' ? children(close) : children}
        </div>
      )}
    </div>
  );
}

export function Dropdown({ icon: Icon, label, value, options, onChange, align = 'right', up = false, compact = false }) {
  const selected = options.find((o) => o.value === value);
  const text = selected && selected.value !== '' ? selected.label : label;
  return (
    <Popover
      align={align}
      up={up}
      trigger={({ open, toggle }) => (
        <button
          type="button"
          className={compact ? 'select-compact' : 'select-btn'}
          aria-expanded={open}
          aria-label={label ? `${label}: ${selected?.label ?? ''}` : undefined}
          onClick={toggle}
        >
          {Icon && <Icon size={14} />}
          <span>{text}</span>
          <ChevronDown size={13} />
        </button>
      )}
    >
      {(close) =>
        options.map((o) => (
          <button
            type="button"
            key={o.value}
            className="menu-item"
            onClick={() => {
              onChange(o.value);
              close();
            }}
          >
            <span>{o.label}</span>
            {o.value === value && <Check size={14} />}
          </button>
        ))
      }
    </Popover>
  );
}

export function LangSwitch() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="lang-switch" role="group" aria-label={t('lang.label')}>
      {['fr', 'en'].map((code) => (
        <button
          type="button"
          key={code}
          lang={code}
          className={lang === code ? 'on' : ''}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function StatusBadge({ status }) {
  const { t } = useI18n();
  const tone = {
    Paid: 'good',
    Approved: 'good',
    Selling: 'good',
    Active: 'good',
    Pending: 'warn',
    Cancelled: 'bad',
    Rejected: 'bad',
    'Sold out': 'bad',
    Ended: 'muted',
    Paused: 'muted',
  }[status] ?? 'muted';
  return (
    <span className={`badge badge-${tone}`}>
      <i aria-hidden="true" />
      {t(`status.${status}`)}
    </span>
  );
}

export function PageIntro({ title, subtitle, action }) {
  return (
    <div className="page-intro">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function MiniStat({ label, value, hint }) {
  return (
    <div className="card mini-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      {hint && <small>{hint}</small>}
    </div>
  );
}
