// Toutes les données sont fictives. Pour brancher une vraie API,
// remplacez les exports de ce fichier par des appels réseau.
// Les textes affichés sont traduits dans src/i18n.jsx.

export const BRAND = 'Prestige Event';

// Ces couleurs changent avec le thème : voir src/styles.css.
export const COLORS = {
  vip: 'var(--s-vip)',
  gold: 'var(--s-gold)',
  festival: 'var(--s-festival)',
};

export const stats = [
  { key: 'total', value: 10000, icon: 'ticket', trend: 'up', prefix: 'stat.update', chipCount: 200, suffixText: '10/11/2026', to: '/admin/ticket-sales' },
  { key: 'revenue', value: 32000000, icon: 'revenue', trend: 'up', prefix: 'stat.upBy', chipPct: 2.9, suffix: 'stat.thisWeek', to: '/admin/earnings' },
  { key: 'sold', value: 9741, icon: 'sold', trend: 'down', prefix: 'stat.down', chipPct: 1.4, suffix: 'stat.fromLastWeek', to: '/admin/ticket-sales' },
  { key: 'available', value: 259, icon: 'available', trend: 'up', prefix: 'stat.upBy', chipPct: 2.9, suffix: 'stat.thisWeek', to: '/admin/events' },
];

export const ticketSegments = [
  { key: 'festival', value: 5978, color: COLORS.festival },
  { key: 'gold', value: 2571, color: COLORS.gold },
  { key: 'vip', value: 1192, color: COLORS.vip },
];

export const CAPACITY = 10000;

export const salesSeries = [
  { key: 'festival', color: COLORS.festival },
  { key: 'gold', color: COLORS.gold },
  { key: 'vip', color: COLORS.vip },
];

export const salesData = {
  Weekly: {
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

const FIRST = ['Ama', 'Koffi', 'Akossiwa', 'Kodjo', 'Abla', 'Komlan', 'Esso', 'Afi', 'Yao', 'Mawuli', 'Efua', 'Sena', 'Kwame', 'Akou', 'Adjo', 'Kossi', 'Dela', 'Mawuena', 'Eyram', 'Atsu'];
const LAST = ['Mensah', 'Adjei', 'Tchalla', 'Amouzou', 'Agbodjan', 'Lawson', 'Amegah', 'Dossou', 'Kouassi', 'Afi', 'Gbogbo', 'Sodji', 'Abalo', 'Amah', 'Togbui', 'Kponton', 'Koudou', 'Aklassou', 'Amah', 'Akakpo'];

export const TICKET_TYPES = ['VIP Ticket', 'Gold Ticket', 'Festival Ticket'];
export const BUYER_STATUSES = ['Paid', 'Pending', 'Cancelled'];

function generateBuyers() {
  const rand = seeded(9741);
  const pick = (list) => list[Math.floor(rand() * list.length)];
  const fixedDate = new Date('2026-11-17T09:32:00');
  const rows = [
    { name: 'Ama Mensah', email: 'ama.mensah@example.tg', phone: '+228 90 12 34 56', type: 'VIP Ticket', date: fixedDate, status: 'Paid' },
    { name: 'Koffi Adjei', email: 'koffi.adjei@example.tg', phone: '+228 91 23 45 67', type: 'VIP Ticket', date: fixedDate, status: 'Cancelled' },
    { name: 'Akossiwa Tchalla', email: 'akossiwa.tchalla@example.tg', phone: '+228 92 34 56 78', type: 'Festival Ticket', date: fixedDate, status: 'Paid' },
    { name: 'Kodjo Amouzou', email: 'kodjo.amouzou@example.tg', phone: '+228 93 45 67 89', type: 'Festival Ticket', date: fixedDate, status: 'Pending' },
  ].map((row) => ({ ...row, month: '2026-11' }));

  const addPeriod = (count, start, month) => {
    const cursor = new Date(start);
    for (let i = 0; i < count; i += 1) {
      cursor.setMinutes(cursor.getMinutes() - Math.floor(30 + rand() * 110));
      const first = pick(FIRST);
      const last = pick(LAST);
      const roll = rand();
      rows.push({
        name: `${first} ${last}`,
        email: `${first}.${last}${Math.floor(rand() * 90 + 10)}@example.tg`.toLowerCase(),
        phone: `+228 ${String(Math.floor(rand() * 1e8)).padStart(8, '0').replace(/(\d{2})(?=\d)/g, '$1 ')}`,
        type: pick(TICKET_TYPES),
        date: new Date(cursor),
        status: roll < 0.72 ? 'Paid' : roll < 0.88 ? 'Pending' : 'Cancelled',
        month,
      });
    }
  };

  addPeriod(296, '2026-11-17T09:32:00', '2026-11');
  addPeriod(180, '2026-10-31T22:00:00', '2026-10');
  addPeriod(150, '2026-09-30T22:00:00', '2026-09');
  return rows.map((row, i) => ({ ...row, id: `TS${9741 - i}` }));
}

export const buyers = generateBuyers();

export const MONTHS = ['2026-11', '2026-10', '2026-09'];

export const events = [
  { id: 1, name: 'Gala de fin d’année', date: '2026-12-05', city: 'Lomé', venue: 'Hôtel 2 Février · Salle de réception', sold: 421, capacity: 500, status: 'Selling', hue: 232 },
  { id: 2, name: 'Dîner des partenaires', date: '2026-11-07', city: 'Lomé', venue: 'Hôtel 2 Février · Restaurant', sold: 180, capacity: 180, status: 'Sold out', hue: 292 },
  { id: 3, name: 'Rencontres économiques de Lomé', date: '2027-01-16', city: 'Lomé', venue: 'Hôtel 2 Février · Centre de conférences', sold: 91, capacity: 150, status: 'Selling', hue: 200 },
  { id: 4, name: 'Soirée Prestige', date: '2026-12-19', city: 'Lomé', venue: 'Hôtel 2 Février · Salle de réception', sold: 64, capacity: 100, status: 'Selling', hue: 52 },
  { id: 5, name: 'Salon du mariage', date: '2027-02-13', city: 'Lomé', venue: 'Hôtel 2 Février · Salle de réception', sold: 138, capacity: 200, status: 'Selling', hue: 92 },
  { id: 6, name: 'Dîner de gala des entreprises', date: '2026-10-24', city: 'Lomé', venue: 'Hôtel 2 Février · Salle de réception', sold: 220, capacity: 220, status: 'Ended', hue: 340 },
];

export const ticketOffers = {
  1: [
    { type: 'Festival Ticket', label: 'Accès standard', price: 25000 },
    { type: 'Gold Ticket', label: 'Accès Gold · placement privilégié', price: 50000 },
    { type: 'VIP Ticket', label: 'Expérience VIP · cocktail inclus', price: 100000 },
  ],
  2: [
    { type: 'Festival Ticket', label: 'Dîner standard', price: 35000 },
    { type: 'Gold Ticket', label: 'Dîner Gold · table réservée', price: 65000 },
    { type: 'VIP Ticket', label: 'Dîner VIP · table premium', price: 120000 },
  ],
  3: [
    { type: 'Festival Ticket', label: 'Pass journée', price: 20000 },
    { type: 'Gold Ticket', label: 'Pass Gold · accès networking', price: 45000 },
    { type: 'VIP Ticket', label: 'Pass VIP · salon privé', price: 90000 },
  ],
  4: [
    { type: 'Festival Ticket', label: 'Entrée standard', price: 30000 },
    { type: 'Gold Ticket', label: 'Entrée Gold · coupe de bienvenue', price: 60000 },
    { type: 'VIP Ticket', label: 'Entrée VIP · accueil privilégié', price: 110000 },
  ],
  5: [
    { type: 'Festival Ticket', label: 'Entrée salon', price: 10000 },
    { type: 'Gold Ticket', label: 'Entrée Gold · coupe-file', price: 20000 },
    { type: 'VIP Ticket', label: 'Entrée VIP · espace dédié', price: 40000 },
  ],
  6: [{ type: 'Festival Ticket', label: 'Entrée standard', price: 25000 }],
};

export const initialPayouts = [
  { id: 'PO-1048', organizer: 'Hôtel 2 Février', event: 'Gala de fin d’année', amount: 1240000, requested: '16/11/2026', status: 'Pending' },
  { id: 'PO-1047', organizer: 'Hôtel 2 Février', event: 'Soirée Prestige', amount: 530000, requested: '15/11/2026', status: 'Pending' },
  { id: 'PO-1046', organizer: 'Hôtel 2 Février', event: 'Dîner des partenaires', amount: 1895000, requested: '10/11/2026', status: 'Pending' },
  { id: 'PO-1045', organizer: 'Hôtel 2 Février', event: 'Dîner de gala des entreprises', amount: 2410000, requested: '02/11/2026', status: 'Approved' },
  { id: 'PO-1044', organizer: 'Hôtel 2 Février', event: 'Rencontres économiques de Lomé', amount: 275000, requested: '28/10/2026', status: 'Rejected' },
];

export const earningsMonthly = [
  { label: 'month.Jun', revenue: 18500000 },
  { label: 'month.Jul', revenue: 22400000 },
  { label: 'month.Aug', revenue: 28100000 },
  { label: 'month.Sep', revenue: 24600000 },
  { label: 'month.Oct', revenue: 29500000 },
  { label: 'month.Nov', revenue: 32000000 },
];

export const initialPromos = [
  { code: 'EARLY25', discount: 25, used: 412, limit: 500, active: true },
  { code: 'VIPNIGHT', discount: 15, used: 88, limit: 200, active: true },
  { code: 'FESTPASS10', discount: 10, used: 1032, limit: 1500, active: true },
  { code: 'NEWYEAR30', discount: 30, used: 300, limit: 300, active: false },
];

export const notifications = [
  { id: 1, title: 'notif.payout', time: 'time.12min', to: '/admin/payouts' },
  { id: 2, title: 'notif.soldOut', time: 'time.2h', to: '/admin/events' },
  { id: 3, title: 'notif.promo', time: 'time.yesterday', to: '/admin/promotions' },
];
