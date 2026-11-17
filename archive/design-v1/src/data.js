// Toutes les données sont fictives. Pour brancher une vraie API,
// remplacez les exports de ce fichier par des appels réseau.
// Les textes affichés sont traduits dans src/i18n.jsx.

export const BRAND = 'Tickets.ID';

export const COLORS = {
  vip: '#9A1FA6',
  gold: '#A2951E',
  festival: '#1F2F9F',
  available: '#6FA51B',
};

export const stats = [
  { key: 'total', value: 10000, icon: 'ticket', trend: 'up', prefix: 'stat.update', chipCount: 200, suffixText: '05/01/2025', to: '/ticket-sales' },
  { key: 'revenue', value: 320, icon: 'revenue', trend: 'up', prefix: 'stat.upBy', chipPct: 2.9, suffix: 'stat.thisWeek', to: '/earnings' },
  { key: 'sold', value: 9741, icon: 'sold', trend: 'down', prefix: 'stat.down', chipPct: 1.4, suffix: 'stat.fromLastWeek', to: '/ticket-sales' },
  { key: 'available', value: 259, icon: 'available', trend: 'up', prefix: 'stat.upBy', chipPct: 2.9, suffix: 'stat.thisWeek', to: '/events' },
];

export const ticketSegments = [
  { key: 'available', value: 259, color: COLORS.available, state: 'available' },
  { key: 'vip', value: 1192, color: COLORS.vip, state: 'sold' },
  { key: 'gold', value: 2571, color: COLORS.gold, state: 'sold' },
  { key: 'festival', value: 5978, color: COLORS.festival, state: 'sold' },
];

export const salesSeries = [
  { key: 'festival', color: COLORS.festival },
  { key: 'gold', color: COLORS.gold },
  { key: 'vip', color: COLORS.vip },
];

export const salesData = {
  Weekly: {
    max: 500,
    step: 100,
    rows: [
      { label: 'day.Mon', festival: 200, gold: 235, vip: 40 },
      { label: 'day.Tue', festival: 280, gold: 120, vip: 55 },
      { label: 'day.Wed', festival: 200, gold: 105, vip: 25 },
      { label: 'day.Thu', festival: 70, gold: 120, vip: 218 },
      { label: 'day.Fri', festival: 395, gold: 395, vip: 45 },
      { label: 'day.Sat', festival: 500, gold: 185, vip: 205 },
      { label: 'day.Sun', festival: 315, gold: 135, vip: 400 },
    ],
  },
  Monthly: {
    max: 2500,
    step: 500,
    rows: [
      { label: 'week.1', festival: 1450, gold: 620, vip: 310 },
      { label: 'week.2', festival: 1820, gold: 840, vip: 260 },
      { label: 'week.3', festival: 2290, gold: 1195, vip: 983 },
      { label: 'week.4', festival: 1160, gold: 716, vip: 339 },
    ],
  },
};

// Générateur pseudo-aléatoire à graine fixe : la démo reste identique à chaque chargement.
function seeded(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ['Stefanie', 'Jian', 'Pedi', 'Berl', 'Maya', 'Rafi', 'Nadia', 'Tomas', 'Lina', 'Omar', 'Sari', 'Hugo', 'Ayu', 'Bima', 'Clara', 'Dimas', 'Elsa', 'Farid', 'Gita', 'Iman'];
const LAST = ['Corn', 'Liam', 'Rian', 'Stefan', 'Putri', 'Adnan', 'Wijaya', 'Marek', 'Halim', 'Salim', 'Dewi', 'Laurent', 'Pratama', 'Sakti', 'Moreau', 'Kusuma', 'Novak', 'Rahman', 'Lestari', 'Basri'];

export const TICKET_TYPES = ['VIP Ticket', 'Gold Ticket', 'Festival Ticket'];
export const BUYER_STATUSES = ['Paid', 'Pending', 'Cancelled'];

function generateBuyers() {
  const rand = seeded(9741);
  const pick = (list) => list[Math.floor(rand() * list.length)];
  const fixedDate = new Date('2025-01-21T09:32:00');
  const rows = [
    { name: 'Stefanie Corn', email: 'stef233@exp.com', phone: '08999323122', type: 'VIP Ticket', date: fixedDate, status: 'Paid' },
    { name: 'Jian Liam', email: 'liam99@exp.com', phone: '08942323550', type: 'VIP Ticket', date: fixedDate, status: 'Cancelled' },
    { name: 'Pedi Rian', email: 'rianz@exp.com', phone: '0899933244', type: 'Festival Ticket', date: fixedDate, status: 'Paid' },
    { name: 'Berl Stefan', email: 'berlstfn@exp.com', phone: '08999932102', type: 'Festival Ticket', date: fixedDate, status: 'Pending' },
  ].map((row) => ({ ...row, month: '2025-01' }));

  const addPeriod = (count, start, month) => {
    const cursor = new Date(start);
    for (let i = 0; i < count; i += 1) {
      cursor.setMinutes(cursor.getMinutes() - Math.floor(30 + rand() * 110));
      const first = pick(FIRST);
      const last = pick(LAST);
      const roll = rand();
      rows.push({
        name: `${first} ${last}`,
        email: `${first}.${last}${Math.floor(rand() * 90 + 10)}@exp.com`.toLowerCase(),
        phone: `089${String(Math.floor(rand() * 1e8)).padStart(8, '0')}`,
        type: pick(TICKET_TYPES),
        date: new Date(cursor),
        status: roll < 0.72 ? 'Paid' : roll < 0.88 ? 'Pending' : 'Cancelled',
        month,
      });
    }
  };

  addPeriod(296, '2025-01-21T09:32:00', '2025-01');
  addPeriod(180, '2024-12-31T22:00:00', '2024-12');
  addPeriod(150, '2024-11-30T22:00:00', '2024-11');
  return rows.map((row, i) => ({ ...row, id: `TS${9741 - i}` }));
}

export const buyers = generateBuyers();

export const MONTHS = ['2025-01', '2024-12', '2024-11'];

export const events = [
  { id: 1, name: 'Sunset Sound Festival', date: '2025-01-25', city: 'Jakarta', venue: 'Harbor Park', sold: 4210, capacity: 4500, status: 'Selling', hue: 232 },
  { id: 2, name: 'Neon Nights Live', date: '2025-01-11', city: 'Bandung', venue: 'Arena Timur', sold: 1800, capacity: 1800, status: 'Sold out', hue: 292 },
  { id: 3, name: 'Harbor Jazz Weekend', date: '2025-02-08', city: 'Surabaya', venue: 'Old Port Hall', sold: 910, capacity: 1500, status: 'Selling', hue: 200 },
  { id: 4, name: 'Golden Hour Gala', date: '2025-01-18', city: 'Bali', venue: 'Cliff Terrace', sold: 640, capacity: 700, status: 'Selling', hue: 52 },
  { id: 5, name: 'Indie Garden Sessions', date: '2025-02-15', city: 'Yogyakarta', venue: 'Taman Hall', sold: 1381, capacity: 1500, status: 'Selling', hue: 92 },
  { id: 6, name: 'Bass Arena Tour', date: '2024-12-21', city: 'Medan', venue: 'North Dome', sold: 2200, capacity: 2200, status: 'Ended', hue: 340 },
];

export const initialPayouts = [
  { id: 'PO-1048', organizer: 'Sunset Sound Co.', event: 'Sunset Sound Festival', amount: 12400, requested: '20/01/2025', status: 'Pending' },
  { id: 'PO-1047', organizer: 'Golden Events', event: 'Golden Hour Gala', amount: 5300, requested: '19/01/2025', status: 'Pending' },
  { id: 'PO-1046', organizer: 'Neon Live', event: 'Neon Nights Live', amount: 18950, requested: '15/01/2025', status: 'Pending' },
  { id: 'PO-1045', organizer: 'North Dome Ltd.', event: 'Bass Arena Tour', amount: 24100, requested: '02/01/2025', status: 'Approved' },
  { id: 'PO-1044', organizer: 'Taman Collective', event: 'Indie Garden Sessions', amount: 2750, requested: '28/12/2024', status: 'Rejected' },
];

export const earningsMonthly = [
  { label: 'month.Aug', revenue: 28 },
  { label: 'month.Sep', revenue: 38 },
  { label: 'month.Oct', revenue: 42 },
  { label: 'month.Nov', revenue: 56 },
  { label: 'month.Dec', revenue: 72 },
  { label: 'month.Jan', revenue: 84 },
];

export const initialPromos = [
  { code: 'EARLY25', discount: 25, used: 412, limit: 500, active: true },
  { code: 'VIPNIGHT', discount: 15, used: 88, limit: 200, active: true },
  { code: 'FESTPASS10', discount: 10, used: 1032, limit: 1500, active: true },
  { code: 'NEWYEAR30', discount: 30, used: 300, limit: 300, active: false },
];

export const notifications = [
  { id: 1, title: 'notif.payout', time: 'time.12min', to: '/payouts' },
  { id: 2, title: 'notif.soldOut', time: 'time.2h', to: '/events' },
  { id: 3, title: 'notif.promo', time: 'time.yesterday', to: '/promotions' },
];
