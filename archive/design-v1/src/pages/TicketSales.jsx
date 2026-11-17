import { useMemo } from 'react';
import { buyers } from '../data.js';
import { useI18n } from '../i18n.jsx';
import { MiniStat, PageIntro } from '../components/ui.jsx';
import BuyersTable from '../components/BuyersTable.jsx';

export default function TicketSales() {
  const { t, fmt } = useI18n();
  const counts = useMemo(() => {
    const january = buyers.filter((b) => b.month === '2025-01');
    return {
      total: january.length,
      paid: january.filter((b) => b.status === 'Paid').length,
      pending: january.filter((b) => b.status === 'Pending').length,
      cancelled: january.filter((b) => b.status === 'Cancelled').length,
    };
  }, []);

  return (
    <div className="page">
      <PageIntro title={t('nav.ticketSales')} subtitle={t('sales.subtitle')} />
      <div className="mini-grid">
        <MiniStat label={t('sales.january')} value={fmt(counts.total)} />
        <MiniStat label={t('status.Paid')} value={fmt(counts.paid)} />
        <MiniStat label={t('status.Pending')} value={fmt(counts.pending)} />
        <MiniStat label={t('status.Cancelled')} value={fmt(counts.cancelled)} />
      </div>
      <BuyersTable title={t('sales.allOrders')} />
    </div>
  );
}
