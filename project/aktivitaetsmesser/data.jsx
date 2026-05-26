/* AKTIVITÄTSMESSER — data layer: activity catalog + storage + day model */

/* ─────────────────────────────────────────────────────────────
   Activity catalog (matches the spec exactly)
   - short: Kurz-Wording in der App-UI
   - label: voller Wortlaut aus der ÜBERSICHT der Word-Vorlage
   - perContact: true  → marked per contact in the bottom sheet
   - perContact: false → daily quick-toggle (one per day)
   ───────────────────────────────────────────────────────────── */
const ACTIVITY_GROUPS = [
  {
    id: 'sichtbarkeit', label: 'Sichtbarkeit', color: 'var(--cat-sicht)', perContact: false,
    items: [
      { id: 'promo',       short: 'Freitags-Angebote', label: 'Freitags-Produktpromotion in der Kundengruppe gepostet',                     pts: 1 },
      { id: 'whatsapp',    short: 'WhatsApp',          label: 'Auf WhatsApp sichtbar gemacht (Status erstellt)',                            pts: 1 },
      { id: 'instafb',     short: 'Insta / Facebook',  label: 'Auf Instagram/Facebook sichtbar gemacht (Story mit Umfragesticker, startet Gespräche)', pts: 1 },
      { id: 'kommentare',  short: '3× Kommentare',     label: '3× auf Nicht-Partner-Accounts kommentiert (Social Media)',                   pts: 1 },
      { id: 'reel',        short: 'Reel',              label: 'Reel / Kurzvideo erstellt & gepostet',                                       pts: 1 },
      { id: 'mehrwert',    short: 'Mehrwert',          label: 'Mehrwert geteilt – Tipp / Ressource',                                        pts: 1 },
    ],
  },
  {
    id: 'kontakt', label: 'Kontakt & Gespräch', color: 'var(--cat-kontakt)', perContact: true,
    items: [
      { id: 'neukontakt',      short: 'Neukontakt',       label: 'Neue Person kennengelernt & auf Kontaktliste erfasst',          pts: 1 },
      { id: 'bedurfnisse',     short: 'Bedürfnisse',      label: 'Persönlichkeitsmerkmale & Bedürfnisse einer Person notiert',    pts: 1 },
      { id: 'altkontakt',      short: 'Altkontakt',       label: 'Kontakt aus der Vergangenheit wiederbelebt',                    pts: 1 },
      { id: 'sprachnachricht', short: 'Sprachnachricht',  label: 'Sprachnachricht an Kontakt geschickt oder telefoniert',         pts: 1 },
      { id: 'messenger',       short: 'Messenger',        label: 'In Austausch über Messenger gegangen',                          pts: 1 },
      { id: 'kompliment',      short: 'Kompliment',       label: 'Ehrliches Kompliment / Dankesnachricht gesendet',               pts: 1 },
      { id: 'weiterempfehlung',short: 'Weiterempfehlung', label: 'Nach Weiterempfehlung gefragt (Kontakte deines Kontakts)',      pts: 1 },
    ],
  },
  {
    id: 'followup', label: 'Follow-Up & Einladung', color: 'var(--cat-follow)', perContact: true,
    items: [
      { id: 'followup',   short: 'Follow-Up',   label: 'Follow-Up Nachricht gesendet (in Kontakt bleiben, ohne Erwartung)',  pts: 1 },
      { id: 'einladung',  short: 'Einladung',   label: 'Zu Fresh date / Businesspräsentation eingeladen',                     pts: 1 },
      { id: 'terminiert', short: 'Terminiert',  label: 'Termin für Fresh date / Businesspräsentation fix vereinbart',         pts: 2 },
      { id: 'teilnahme',  short: 'Teilnahme',   label: 'Kontakt hat an Fresh date / Businesspräsentation teilgenommen',       pts: 2 },
    ],
  },
  {
    id: 'umsatz', label: 'Direkter Umsatz', color: 'var(--cat-umsatz)', perContact: true,
    items: [
      { id: 'bestellung',   short: 'Bestellung',   label: 'Produktbestellung aufgegeben',          pts: 2 },
      { id: 'neupartner',   short: 'Neupartner',   label: 'Neupartner eingeschrieben',             pts: 3 },
      { id: 'founderbonus', short: 'Founderbonus', label: 'Neupartner mit Founderbonus eingeschrieben', pts: 5 },
    ],
  },
  {
    id: 'mindset', label: 'Mindset', color: 'var(--cat-mindset)', perContact: false,
    items: [
      { id: 'mindset15',       short: '15 Min Mindset',   label: '15 Min. Mindset-Arbeit (Buch / Podcast / Video)', pts: 1 },
      { id: 'wochenreflexion', short: 'Wochenreflexion',  label: 'Wochenreflexion / Rückblick gemacht',             pts: 3 },
    ],
  },
];

/* Flattened lookup of every activity by id */
const ACTIVITY_BY_ID = ACTIVITY_GROUPS.reduce((m, g) => {
  g.items.forEach(i => { m[i.id] = { ...i, groupId: g.id, color: g.color, groupLabel: g.label }; });
  return m;
}, {});

const PER_CONTACT_GROUPS = ACTIVITY_GROUPS.filter(g => g.perContact);
const DAILY_GROUPS       = ACTIVITY_GROUPS.filter(g => !g.perContact);

/* ─────────────────────────────────────────────────────────────
   Date helpers
   ───────────────────────────────────────────────────────────── */
const MIN_DATE = new Date(2026, 0, 1);    // 01.01.2026
const MAX_DATE = new Date(2040, 11, 31);  // 31.12.2040

function isoDay(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function parseIso(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function addDays(d, n) {
  const c = new Date(d); c.setDate(c.getDate() + n); return c;
}
function startOfWeek(d) {
  // Monday-first
  const c = new Date(d); c.setHours(0,0,0,0);
  const dow = (c.getDay() + 6) % 7; // 0=Mon … 6=Sun
  c.setDate(c.getDate() - dow);
  return c;
}
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d)   { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
function sameDay(a, b)   { return isoDay(a) === isoDay(b); }

const DE_WEEKDAYS_LONG  = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
const DE_WEEKDAYS_SHORT = ['Mo','Di','Mi','Do','Fr','Sa','So'];
const DE_MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

function formatDateLong(d) {
  return `${DE_WEEKDAYS_LONG[d.getDay()]}, ${d.getDate()}. ${DE_MONTHS[d.getMonth()]}`;
}
function formatDateShort(d) {
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
}
function formatMonth(d) {
  return `${DE_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/* ─────────────────────────────────────────────────────────────
   Storage  (localStorage with namespacing)
   ───────────────────────────────────────────────────────────── */
const STORAGE_KEY = 'aktivitaetsmesser:v1';

const DEFAULT_STATE = {
  user: { name: '', dailyGoalDefault: 10, anonymized: false, onboarded: false },
  contacts: [],          // [{ id, name, createdAt }]
  days: {},              // { 'YYYY-MM-DD': { goal?, contactActivities: { contactId: [id…] }, daily: [id…] } }
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
}

/* ─────────────────────────────────────────────────────────────
   Day model helpers
   ───────────────────────────────────────────────────────────── */
function getDay(state, iso) {
  return state.days[iso] || { goal: null, contactActivities: {}, daily: [] };
}
function dayPoints(state, iso) {
  const day = getDay(state, iso);
  let pts = 0;
  // daily activities
  (day.daily || []).forEach(aid => {
    const a = ACTIVITY_BY_ID[aid]; if (a) pts += a.pts;
  });
  // per-contact activities
  Object.values(day.contactActivities || {}).forEach(ids => {
    ids.forEach(aid => {
      const a = ACTIVITY_BY_ID[aid]; if (a) pts += a.pts;
    });
  });
  return pts;
}
function contactPointsOnDay(state, iso, contactId) {
  const day = getDay(state, iso);
  const ids = (day.contactActivities && day.contactActivities[contactId]) || [];
  return ids.reduce((s, aid) => s + (ACTIVITY_BY_ID[aid]?.pts || 0), 0);
}
function dayGoal(state, iso) {
  const day = getDay(state, iso);
  return day.goal != null ? day.goal : state.user.dailyGoalDefault;
}
function weekPoints(state, anchorIso) {
  const anchor = parseIso(anchorIso);
  const start = startOfWeek(anchor);
  let s = 0;
  for (let i = 0; i < 7; i++) {
    const d = addDays(start, i);
    if (d > new Date()) break;
    if (d < MIN_DATE) continue;
    s += dayPoints(state, isoDay(d));
  }
  return s;
}
function monthPoints(state, anchorIso) {
  const anchor = parseIso(anchorIso);
  const s = startOfMonth(anchor);
  const e = endOfMonth(anchor);
  let total = 0;
  for (let d = new Date(s); d <= e && d <= new Date(); d = addDays(d, 1)) {
    if (d < MIN_DATE) continue;
    total += dayPoints(state, isoDay(d));
  }
  return total;
}

/* ─────────────────────────────────────────────────────────────
   Mutation helpers (return a new state object)
   ───────────────────────────────────────────────────────────── */
function withDay(state, iso, mutator) {
  const day = JSON.parse(JSON.stringify(getDay(state, iso)));
  mutator(day);
  return { ...state, days: { ...state.days, [iso]: day } };
}
function toggleDailyActivity(state, iso, aid) {
  return withDay(state, iso, d => {
    d.daily = d.daily || [];
    const i = d.daily.indexOf(aid);
    if (i >= 0) d.daily.splice(i, 1);
    else d.daily.push(aid);
  });
}
function toggleContactActivity(state, iso, contactId, aid) {
  return withDay(state, iso, d => {
    d.contactActivities = d.contactActivities || {};
    const arr = d.contactActivities[contactId] = d.contactActivities[contactId] || [];
    const i = arr.indexOf(aid);
    if (i >= 0) arr.splice(i, 1);
    else arr.push(aid);
    if (arr.length === 0) delete d.contactActivities[contactId];
  });
}
function addContact(state, name) {
  const id = 'c' + (Date.now().toString(36)) + Math.random().toString(36).slice(2, 5);
  return {
    ...state,
    contacts: [...state.contacts, { id, name: name.trim(), createdAt: isoDay(new Date()) }],
  };
}
function renameContact(state, id, name) {
  return {
    ...state,
    contacts: state.contacts.map(c => c.id === id ? { ...c, name: name.trim() } : c),
  };
}
function anonymizeContacts(state) {
  return {
    ...state,
    user: { ...state.user, anonymized: true },
    contacts: state.contacts.map((c, i) => ({ ...c, name: `Person ${i + 1}` })),
  };
}
function setDailyGoalForDay(state, iso, goal) {
  return withDay(state, iso, d => { d.goal = goal; });
}

Object.assign(window, {
  ACTIVITY_GROUPS, ACTIVITY_BY_ID, PER_CONTACT_GROUPS, DAILY_GROUPS,
  MIN_DATE, MAX_DATE, isoDay, parseIso, addDays, startOfWeek, startOfMonth, endOfMonth, sameDay,
  DE_WEEKDAYS_LONG, DE_WEEKDAYS_SHORT, DE_MONTHS,
  formatDateLong, formatDateShort, formatMonth,
  loadState, saveState, DEFAULT_STATE,
  getDay, dayPoints, contactPointsOnDay, dayGoal, weekPoints, monthPoints,
  toggleDailyActivity, toggleContactActivity, addContact, renameContact, anonymizeContacts,
  setDailyGoalForDay,
});
