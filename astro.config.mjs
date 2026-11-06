// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { copyFile, rm } from 'node:fs/promises';
import { loadEnv } from 'vite';

// Values from the shell (Cloudflare Pages build variables) take priority over a local .env file.
const fileEnv = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const readEnv = (/** @type {string} */ name) => process.env[name] ?? fileEnv[name] ?? '';

// The production address of the site. Set SITE_URL in Cloudflare Pages once the project
// name is known, for example https://udyamsetu.pages.dev
const SITE_URL = (readEnv('SITE_URL') || 'https://udyamsetu.pages.dev').replace(/\/+$/, '');

// Cloudflare Pages sets CF_PAGES and CF_PAGES_BRANCH during every build.
// Builds of other branches are preview deployments and are kept out of search engines.
const productionBranch = readEnv('PRODUCTION_BRANCH') || 'main';
const isPreviewBuild = readEnv('CF_PAGES') === '1' && readEnv('CF_PAGES_BRANCH') !== productionBranch;

const optionalPublicString = () => envField.string({ context: 'client', access: 'public', optional: true });

// Fonts are self-hosted from the Fontsource packages in node_modules, so builds need no font CDN.
// The unicode ranges match the Fontsource subsets. Browsers download a file only when the page
// uses a character from its range, so English pages never download the Devanagari font.
/** @type {[string, ...string[]]} */
const LATIN_RANGE = [
  'U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+02BB-02BC', 'U+02C6', 'U+02DA', 'U+02DC', 'U+0304',
  'U+0308', 'U+0329', 'U+2000-206F', 'U+20AC', 'U+2122', 'U+2191', 'U+2193', 'U+2212', 'U+2215',
  'U+FEFF', 'U+FFFD',
];
/** @type {[string, ...string[]]} */
const DEVANAGARI_RANGE = [
  'U+0900-097F', 'U+1CD0-1CF9', 'U+200C-200D', 'U+20A8', 'U+20B9', 'U+20F0', 'U+25CC', 'U+A830-A839',
  'U+A8E0-A8FF', 'U+11B00-11B09',
];
const latoFile = (/** @type {number} */ weight, /** @type {'normal' | 'italic'} */ style) => ({
  weight,
  style,
  unicodeRange: LATIN_RANGE,
  src: /** @type {[string]} */ ([`./node_modules/@fontsource/lato/files/lato-latin-${weight}-${style}.woff2`]),
});

/**
 * Cloudflare Pages serves the nearest 404.html for a missing page. Astro builds the Hindi
 * "page not found" page as hi/404/index.html, so it is moved to hi/404.html after the build.
 */
const localizedNotFound = {
  name: 'udyamsetu-localized-404',
  hooks: {
    'astro:build:done': async (/** @type {{ dir: URL }} */ { dir }) => {
      await copyFile(new URL('hi/404/index.html', dir), new URL('hi/404.html', dir));
      await rm(new URL('hi/404/', dir), { recursive: true, force: true });
    },
  },
};

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  // Keep HTML-aware whitespace handling so spaces between inline elements are preserved.
  compressHTML: true,
  i18n: {
    locales: ['en', 'hi'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Lato',
      cssVariable: '--font-lato',
      fallbacks: ['Arial', 'sans-serif'],
      options: {
        variants: [latoFile(400, 'normal'), latoFile(400, 'italic'), latoFile(700, 'normal'), latoFile(900, 'normal')],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Noto Sans Devanagari',
      cssVariable: '--font-devanagari',
      // No generic fallback here: the stack in global.css continues with Lato and its fallbacks.
      fallbacks: [],
      optimizedFallbacks: false,
      options: {
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            unicodeRange: DEVANAGARI_RANGE,
            src: [
              './node_modules/@fontsource-variable/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-wght-normal.woff2',
            ],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-plex-mono',
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [
          {
            weight: 500,
            style: 'normal',
            unicodeRange: LATIN_RANGE,
            src: ['./node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2'],
          },
        ],
      },
    },
  ],
  env: {
    schema: {
      // Tally form share links, for example https://tally.so/r/abc123
      PUBLIC_TALLY_CONTACT_URL: optionalPublicString(),
      PUBLIC_TALLY_PARTNERSHIP_URL: optionalPublicString(),
      PUBLIC_TALLY_RESEARCH_URL: optionalPublicString(),
      PUBLIC_TALLY_CAREERS_URL: optionalPublicString(),
      PUBLIC_TALLY_NEWSLETTER_URL: optionalPublicString(),
      // Google Play Store listings and the web login of the Trainer and Trainee applications.
      PUBLIC_TRAINER_APP_URL: optionalPublicString(),
      PUBLIC_TRAINEE_APP_URL: optionalPublicString(),
      PUBLIC_APP_LOGIN_URL: optionalPublicString(),
      // Only needed when Web Analytics is not enabled from the Cloudflare Pages dashboard.
      PUBLIC_CF_WEB_ANALYTICS_TOKEN: optionalPublicString(),
      // Shows editorial notes about missing content. Use it for preview deployments only.
      PUBLIC_SHOW_EDITORIAL_NOTES: envField.boolean({ context: 'client', access: 'public', default: false }),
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-IN', hi: 'hi-IN' },
      },
      filter: (page) => !/\/404\/?$/.test(page),
    }),
    localizedNotFound,
  ],
  vite: {
    plugins: [tailwindcss()],
    define: {
      __PREVIEW_BUILD__: JSON.stringify(isPreviewBuild),
    },
  },
});
