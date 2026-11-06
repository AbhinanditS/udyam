/** Returns the URL when it is a valid https link, otherwise an empty string. */
export function httpsUrl(value: string | undefined | null): string {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return '';
  try {
    const url = new URL(trimmed);
    return url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/** Builds an absolute URL on the production site. */
export function absoluteUrl(path: string, site: URL | string | undefined): string {
  const base = site ? new URL(String(site)) : new URL('https://udyamsetu.pages.dev');
  return new URL(path, base).toString();
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
