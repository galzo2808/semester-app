// Date helpers. All dates are stored as local ISO strings "YYYY-MM-DD",
// which sort and compare correctly as plain strings.

export type ISODate = string;

const pad = (n: number) => String(n).padStart(2, '0');

export function toISODate(d: Date): ISODate {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromISODate(iso: ISODate): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayISO(now: Date = new Date()): ISODate {
  return toISODate(now);
}

export function addDays(iso: ISODate, days: number): ISODate {
  const d = fromISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** Whole days from `from` to `to` (negative if `to` is earlier). DST-safe. */
export function daysBetween(from: ISODate, to: ISODate): number {
  const utc = (iso: ISODate) => {
    const [y, m, d] = iso.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((utc(to) - utc(from)) / 86_400_000);
}

/** 0 = Sunday … 6 = Saturday. */
export function weekday(iso: ISODate): number {
  return fromISODate(iso).getDay();
}

/** The Sunday that opens the week containing `iso`. */
export function startOfWeek(iso: ISODate): ISODate {
  return addDays(iso, -weekday(iso));
}

/** "31.10.2026" */
export function formatDate(iso: ISODate): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}.${m}.${y}`;
}

/** "31.10" */
export function formatShortDate(iso: ISODate): string {
  const [, m, d] = iso.split('-').map(Number);
  return `${d}.${m}`;
}
