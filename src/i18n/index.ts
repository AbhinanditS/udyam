import { en } from './en';
import { hi } from './hi';
import { defaultLocale, localeMeta, locales, type Locale } from './locales';

export { defaultLocale, isLocale, localeMeta, locales, type Locale } from './locales';
export type { Dictionary } from './en';

const dictionaries = { en, hi } as const;

/** Returns the full, type-checked dictionary for a locale. */
export function useTranslations(locale: Locale) {
  return dictionaries[locale];
}

/** Text that exists in English and may also have an approved Hindi version. */
export type LocalizedText = { en: string; hi?: string | undefined };

export type LocalizedValue = {
  text: string;
  /** The language the text is actually written in. */
  lang: Locale;
  /** True when the requested language was missing and English is shown instead. */
  isFallback: boolean;
};

/**
 * Picks the text for a locale. When the Hindi version is missing, the English text is returned
 * with isFallback set, so the component can mark it with lang="en" and a notice.
 */
export function pick(field: LocalizedText, locale: Locale): LocalizedValue {
  const localized = locale === 'hi' ? field.hi?.trim() : field.en;
  if (localized) {
    return { text: localized, lang: locale, isFallback: false };
  }
  return { text: field.en, lang: 'en', isFallback: locale !== 'en' };
}

/** Plain string version of pick() for attributes such as alt text and titles. */
export function pickText(field: LocalizedText | undefined, locale: Locale): string {
  return field ? pick(field, locale).text : '';
}

/** Adds the locale prefix to an internal path. Paths always end with a slash. */
export function localizePath(path: string, locale: Locale): string {
  const [pathname = '/', hash] = path.split('#');
  let clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (!clean.endsWith('/')) clean = `${clean}/`;
  const prefixed = locale === defaultLocale ? clean : clean === '/' ? `/${locale}/` : `/${locale}${clean}`;
  return hash ? `${prefixed}#${hash}` : prefixed;
}

/** Removes a locale prefix from a pathname, returning the path shared by all languages. */
export function stripLocale(pathname: string): string {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}` || pathname === `/${locale}/`) return '/';
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname || '/';
}

/** Static paths for pages that exist in every language. Use in getStaticPaths(). */
export function localeStaticPaths() {
  return locales.map((locale) => ({
    params: { locale: locale === defaultLocale ? undefined : locale },
    props: { locale },
  }));
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeMeta[locale].intl).format(value);
}

export function formatDate(
  value: Date,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' },
): string {
  return new Intl.DateTimeFormat(localeMeta[locale].intl, { timeZone: 'Asia/Kolkata', ...options }).format(value);
}

/** Replaces {name} placeholders in a dictionary string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
