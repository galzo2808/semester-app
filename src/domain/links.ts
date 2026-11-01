// Link helpers for reading items.

/** Accepts what people paste: adds https:// when missing; returns null if it is not a web address. */
export function normalizeUrl(input: string): string | null {
  const text = input.trim();
  if (!text) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (!url.hostname.includes('.')) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Google Scholar search for an item that has no link yet. */
export function scholarSearchUrl(title: string, author: string): string {
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(`${title} ${author}`.trim())}`;
}
