import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Filter, Search, Ticket } from 'lucide-react';
import { BUYER_STATUSES, MONTHS, TICKET_TYPES, buyers } from '../data.js';
import { useI18n } from '../i18n.jsx';
import { Dropdown, StatusBadge } from './ui.jsx';

const PAGE_SIZES = [12, 25, 50].map((n) => ({ value: n, label: String(n) }));

function pageList(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, '…', total];
  if (current >= total - 2) return [1, '…', total - 2, total - 1, total];
  return [1, '…', current, '…', total];
}

export default function BuyersTable({ title }) {
  const { t, fmt, dateTime, monthYear } = useI18n();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [month, setMonth] = useState('2025-01');
  const [pageSize, setPageSize] = useState(12);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return buyers.filter(
      (b) =>
        b.month === month &&
        (!status || b.status === status) &&
        (!type || b.type === type) &&
        (!q || [b.id, b.name, b.email, b.phone, t(`type.${b.type}`)].some((field) => field.toLowerCase().includes(q))),
    );
  }, [query, status, type, month, t]);

  const statusOptions = [
    { value: '', label: t('buyers.allStatuses') },
    ...BUYER_STATUSES.map((value) => ({ value, label: t(`status.${value}`) })),
  ];
  const typeOptions = [
    { value: '', label: t('buyers.allTypes') },
    ...TICKET_TYPES.map((value) => ({ value, label: t(`type.${value}`) })),
  ];
  const monthOptions = MONTHS.map((value) => ({ value, label: monthYear(new Date(`${value}-15T12:00:00`)) }));

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * pageSize, current * pageSize);
  const change = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  return (
    <section className="card buyers">
      <div className="buyers-head">
        <h3>{title ?? t('buyers.title')}</h3>
        <label className="search">
          <Search size={14} aria-hidden="true" />
          <input
            type="search"
            aria-label={t('buyers.search')}
            placeholder={t('buyers.placeholder')}
            value={query}
            onChange={(e) => change(setQuery)(e.target.value)}
          />
        </label>
        <div className="buyers-filters">
          <Dropdown icon={Filter} label={t('buyers.filter')} value={status} options={statusOptions} onChange={change(setStatus)} />
          <Dropdown icon={Ticket} label={t('buyers.ticketType')} value={type} options={typeOptions} onChange={change(setType)} />
          <Dropdown icon={CalendarDays} label={t('buyers.month')} value={month} options={monthOptions} onChange={change(setMonth)} />
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>{t('buyers.id')}</th>
              <th>{t('buyers.name')}</th>
              <th>{t('buyers.email')}</th>
              <th>{t('buyers.phone')}</th>
              <th>{t('buyers.ticketType')}</th>
              <th>{t('buyers.date')}</th>
              <th>{t('buyers.status')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.name}</td>
                <td>{b.email}</td>
                <td>{b.phone}</td>
                <td>{t(`type.${b.type}`)}</td>
                <td>{dateTime(b.date)}</td>
                <td>
                  <StatusBadge status={b.status} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="empty">
                  {t('buyers.empty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-foot">
        <div className="table-count">
          <span>{t('buyers.show')}</span>
          <Dropdown compact align="left" up value={pageSize} options={PAGE_SIZES} onChange={change(setPageSize)} />
          <span>{t('buyers.results', { n: fmt(filtered.length) })}</span>
        </div>
        <nav className="pager" aria-label={t('pager.aria')}>
          <button type="button" aria-label={t('pager.prev')} disabled={current === 1} onClick={() => setPage(current - 1)}>
            <ChevronLeft size={15} />
          </button>
          {pageList(current, totalPages).map((p, i) =>
            p === '…' ? (
              <span key={`gap-${i}`}>…</span>
            ) : (
              <button
                type="button"
                key={p}
                className={p === current ? 'current' : ''}
                aria-current={p === current ? 'page' : undefined}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ),
          )}
          <button type="button" aria-label={t('pager.next')} disabled={current === totalPages} onClick={() => setPage(current + 1)}>
            <ChevronRight size={15} />
          </button>
        </nav>
      </div>
    </section>
  );
}
