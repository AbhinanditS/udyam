/**
 * Central site configuration.
 *
 * Organisation details are edited here. Form, app and analytics links come from environment
 * variables (see .env.example). An environment variable always overrides the value in this file.
 * Leave a value empty when it is not known. The website then shows a "coming soon" or
 * "not available yet" state instead of a broken link or invented information.
 */
import {
  PUBLIC_APP_LOGIN_URL,
  PUBLIC_CF_WEB_ANALYTICS_TOKEN,
  PUBLIC_SHOW_EDITORIAL_NOTES,
  PUBLIC_TALLY_CAREERS_URL,
  PUBLIC_TALLY_CONTACT_URL,
  PUBLIC_TALLY_NEWSLETTER_URL,
  PUBLIC_TALLY_PARTNERSHIP_URL,
  PUBLIC_TALLY_RESEARCH_URL,
  PUBLIC_TRAINEE_APP_URL,
  PUBLIC_TRAINER_APP_URL,
} from 'astro:env/client';
import type { LocalizedText } from '@/i18n';
import { httpsUrl } from '@/utils/urls';

/** Values used when the matching environment variable is not set. Keep them empty until confirmed. */
const fallbacks = {
  forms: {
    contact: '',
    partnership: '',
    research: '',
    careers: '',
    newsletter: '',
  },
  apps: {
    trainerPlayStore: '',
    traineePlayStore: '',
    login: '',
  },
};

export const siteConfig = {
  organisation: {
    name: 'UdyamSetu Pvt. Ltd.',
    shortName: 'UdyamSetu',
  },

  /** Contact details shown on the Contact page, in the footer and in structured data. */
  contact: {
    /** Full postal address of the corporate office. Add the Hindi version when it is approved. */
    address: { en: '', hi: '' } satisfies LocalizedText,
    email: '',
    /** International format, for example +91 11 1234 5678 */
    phone: '',
    /** Office coordinates for the OpenStreetMap embed. The map shows only when both are set. */
    map: {
      latitude: undefined as number | undefined,
      longitude: undefined as number | undefined,
      zoom: 16,
    },
  },

  /** Tally form links. Use the share link from Tally, for example https://tally.so/r/abc123 */
  forms: {
    contact: httpsUrl(PUBLIC_TALLY_CONTACT_URL) || fallbacks.forms.contact,
    partnership: httpsUrl(PUBLIC_TALLY_PARTNERSHIP_URL) || fallbacks.forms.partnership,
    research: httpsUrl(PUBLIC_TALLY_RESEARCH_URL) || fallbacks.forms.research,
    careers: httpsUrl(PUBLIC_TALLY_CAREERS_URL) || fallbacks.forms.careers,
    newsletter: httpsUrl(PUBLIC_TALLY_NEWSLETTER_URL) || fallbacks.forms.newsletter,
  },

  /** Google Play listings and the web login of the existing Trainer and Trainee application. */
  apps: {
    trainerPlayStore: httpsUrl(PUBLIC_TRAINER_APP_URL) || fallbacks.apps.trainerPlayStore,
    traineePlayStore: httpsUrl(PUBLIC_TRAINEE_APP_URL) || fallbacks.apps.traineePlayStore,
    login: httpsUrl(PUBLIC_APP_LOGIN_URL) || fallbacks.apps.login,
  },

  /**
   * Downloadable documents. Put the PDF in public/documents/ and write its path here,
   * for example '/documents/udyamsetu-csr-proposal-deck.pdf'. The download button appears
   * only when the file exists.
   */
  documents: {
    csrProposalDeck: '',
  },

  /**
   * Alt text for the optional site photographs in src/assets/images/hero/ and
   * src/assets/images/overview/. Describe what the photograph shows.
   */
  photos: {
    hero: { alt: { en: '', hi: '' } satisfies LocalizedText },
    overview: { alt: { en: '', hi: '' } satisfies LocalizedText },
  },

  analytics: {
    /** Only needed when Web Analytics is not enabled from the Cloudflare Pages dashboard. */
    cloudflareToken: (PUBLIC_CF_WEB_ANALYTICS_TOKEN ?? '').trim(),
  },

  /** Editorial notes about missing content. Always on in local development. */
  showEditorialNotes: import.meta.env.DEV || PUBLIC_SHOW_EDITORIAL_NOTES === true,
};

export type FormKey = keyof typeof siteConfig.forms;
