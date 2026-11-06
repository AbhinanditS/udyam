export const locales = ['en', 'hi'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeMeta = {
  en: {
    htmlLang: 'en-IN',
    hreflang: 'en-IN',
    ogLocale: 'en_IN',
    intl: 'en-IN',
    short: 'EN',
    name: 'English',
  },
  hi: {
    htmlLang: 'hi-IN',
    hreflang: 'hi-IN',
    ogLocale: 'hi_IN',
    intl: 'hi-IN',
    short: 'HI',
    name: 'हिन्दी',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
