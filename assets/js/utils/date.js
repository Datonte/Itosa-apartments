// Date utilities. All public functions accept either Date instances or ISO strings.

export function isoDate(d) {
  const x = d instanceof Date ? d : new Date(d);
  // Use local-time slicing to avoid TZ shift on en-NG users
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function nightsBetween(checkin, checkout) {
  const a = new Date(checkin);
  const b = new Date(checkout);
  return Math.max(0, Math.round((b - a) / 86400000));
}

export function formatDate(d, locale = "en-NG", opts = { day: "numeric", month: "short", year: "numeric" }) {
  if (!d) return "";
  return new Date(d).toLocaleDateString(locale, opts);
}

export function formatDateLong(d, locale = "en-NG") {
  return formatDate(d, locale, { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}

export function addDays(d, n) {
  const x = d instanceof Date ? new Date(d) : new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function rangesOverlap(a, b) {
  return new Date(a.start) <= new Date(b.end) && new Date(b.start) <= new Date(a.end);
}

// Returns an array of ISO date strings between start and end inclusive.
// Use sparingly — bounded by a 365-day safety cap.
export function expandRange(start, end) {
  const out = [];
  let cur = new Date(start);
  const last = new Date(end);
  let safety = 0;
  while (cur <= last && safety < 366) {
    out.push(isoDate(cur));
    cur = addDays(cur, 1);
    safety++;
  }
  return out;
}

export function todayIso() {
  return isoDate(new Date());
}

export function isPast(iso) {
  return new Date(iso) < new Date(todayIso());
}
