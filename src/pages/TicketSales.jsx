import { useMemo } from 'react';
import { buyers } from '../data.js';
import { useI18n } from '../i18n.jsx';
import { MiniStat, PageIntro } from '../components/ui.jsx';
import BuyersTable from '../components/BuyersTable.jsx';

export default function TicketSales() {
  const { t } = useI18n();
  const counts = useMemo(() => {
    const november = buyers.filter((b) => b.month === '2026-11');
    return {
      total: november.length,
      paid: november.filter((b) => b.status === 'Paid').length,
      pending: november.filter((b) => b.status === 'Pending').length,
      cancelled: november.filter((b) => b.status === 'Cancelled').length,
    };
  }, []);

  return (
    <div className="page">
      <PageIntro title={t('nav.ticketSales')} subtitle={t('sales.subtitle')} />
      <div className="mini-grid">
        <MiniStat label={t('month.Nov')} value={counts.total} />
        <MiniStat label={t('status.Paid')} value={counts.paid} />
        <MiniStat label={t('status.Pending')} value={counts.pending} />
        <MiniStat label={t('status.Cancelled')} value={counts.cancelled} />
      </div>
      <BuyersTable title={t('sales.allOrders')} />
    </div>
  );
}
