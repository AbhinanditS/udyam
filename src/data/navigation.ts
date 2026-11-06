import type { Dictionary } from '@/i18n';

/** Every internal page, without the language prefix. Hindi pages add /hi in front. */
export const routes = {
  home: '/',
  about: '/about/',
  whatWeDo: '/what-we-do/',
  impact: '/impact/',
  media: '/media-events/',
  gallery: '/media-events/gallery/',
  collaborations: '/collaborations/',
  research: '/research/',
  testimonials: '/testimonials/',
  careers: '/careers/',
  contact: '/contact/',
  apps: '/apps/',
  terms: '/terms/',
  privacy: '/privacy/',
  sitemap: '/sitemap/',
} as const;

export type RouteKey = keyof typeof routes;
type NavLabel = keyof Dictionary['nav'];

export const workAreaPath = (slug: string) => `/what-we-do/${slug}/`;

export type NavItem = {
  route: RouteKey;
  label: NavLabel;
  /** Shorter label for the desktop bar, where space is limited. */
  shortLabel?: NavLabel;
  /** Shows the work-areas menu next to this item. */
  hasWorkAreasMenu?: boolean;
};

/** Primary navigation, in order. */
export const primaryNav: NavItem[] = [
  { route: 'home', label: 'home' },
  { route: 'about', label: 'about' },
  { route: 'whatWeDo', label: 'whatWeDo', hasWorkAreasMenu: true },
  { route: 'impact', label: 'impact' },
  { route: 'media', label: 'media' },
  { route: 'collaborations', label: 'collaborations' },
  { route: 'research', label: 'research', shortLabel: 'researchShort' },
  { route: 'careers', label: 'careers' },
  { route: 'contact', label: 'contact' },
];

export const footerQuickLinks: { route: RouteKey; label: NavLabel }[] = [
  { route: 'home', label: 'home' },
  { route: 'about', label: 'about' },
  { route: 'whatWeDo', label: 'whatWeDo' },
  { route: 'impact', label: 'impact' },
  { route: 'media', label: 'media' },
  { route: 'collaborations', label: 'collaborations' },
  { route: 'research', label: 'research' },
  { route: 'testimonials', label: 'testimonials' },
  { route: 'careers', label: 'careers' },
  { route: 'contact', label: 'contact' },
];

export const footerLegalLinks: { route: RouteKey; label: NavLabel }[] = [
  { route: 'terms', label: 'terms' },
  { route: 'privacy', label: 'privacy' },
  { route: 'sitemap', label: 'sitemap' },
];
