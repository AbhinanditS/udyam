import { localizePath, stripLocale, useTranslations, type Locale } from '@/i18n';
import { routes, type RouteKey } from '@/data/navigation';

/** Reads the page language from its URL. Hindi pages live under /hi/. */
export function getLocale(url: URL): Locale {
  return url.pathname === '/hi' || url.pathname.startsWith('/hi/') ? 'hi' : 'en';
}

/** Language, dictionary and link helpers for the current page. */
export function pageContext(url: URL) {
  const locale = getLocale(url);
  return {
    locale,
    t: useTranslations(locale),
    /** Localized link to a named route, with an optional #anchor. */
    href: (route: RouteKey, hash?: string) => localizePath(hash ? `${routes[route]}#${hash}` : routes[route], locale),
    /** Localized link to any internal path. */
    path: (path: string) => localizePath(path, locale),
    /** The same page in the other language. */
    alternate: (target: Locale) => localizePath(stripLocale(url.pathname), target),
  };
}
