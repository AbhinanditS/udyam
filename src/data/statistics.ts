import type { LocalizedText } from '@/i18n';
import type { IconName } from './icon-names';

/**
 * Impact figures shown on the website.
 *
 * Rules:
 * - Set status to 'published' only for a figure the organisation has verified.
 * - A figure with status 'pending' never shows a number. The website shows "verified figure pending".
 * - Add asOf (YYYY-MM-DD) and source when they are known, so readers can see how current a figure is.
 */
export type Statistic = {
  id: string;
  value: number | null;
  prefix?: string;
  suffix?: string;
  label: LocalizedText;
  status: 'published' | 'pending';
  asOf?: string;
  source?: LocalizedText;
};

/** Headline figures for the home page and the Impact page. Supplied by UdyamSetu in the website brief. */
export const headlineStats: Statistic[] = [
  {
    id: 'trainers',
    value: 10000,
    suffix: '+',
    label: { en: 'Trainers', hi: 'प्रशिक्षक' },
    status: 'published',
  },
  {
    id: 'beneficiaries',
    value: 100000,
    suffix: '+',
    label: { en: 'Beneficiaries', hi: 'लाभार्थी' },
    status: 'published',
  },
  {
    id: 'states',
    value: 28,
    label: { en: 'States reached', hi: 'राज्यों तक पहुँच' },
    status: 'published',
  },
];

export type ImpactIndicator = Statistic & {
  icon: IconName;
  description: LocalizedText;
};

/** Impact dashboard indicators. Values stay null until verified figures are supplied. */
export const impactIndicators: ImpactIndicator[] = [
  {
    id: 'trainers-certified',
    icon: 'badge-check',
    value: null,
    status: 'pending',
    label: { en: 'Trainers certified', hi: 'प्रमाणित प्रशिक्षक' },
    description: {
      en: 'Domain skill trainers who have completed certification.',
      hi: 'डोमेन कौशल प्रशिक्षक, जिन्होंने प्रमाणन पूरा किया है।',
    },
  },
  {
    id: 'trainees-onboarded',
    icon: 'user-check',
    value: null,
    status: 'pending',
    label: { en: 'Trainees onboarded', hi: 'ऑनबोर्ड किए गए प्रशिक्षु' },
    description: {
      en: 'Trainees registered through app-based onboarding.',
      hi: 'ऐप आधारित ऑनबोर्डिंग से पंजीकृत प्रशिक्षु।',
    },
  },
  {
    id: 'csr-projects',
    icon: 'clipboard-list',
    value: null,
    status: 'pending',
    label: { en: 'CSR projects implemented', hi: 'लागू की गई सीएसआर परियोजनाएँ' },
    description: {
      en: 'Projects delivered with corporate social responsibility funding.',
      hi: 'कॉर्पोरेट सामाजिक उत्तरदायित्व निधि से पूरी की गई परियोजनाएँ।',
    },
  },
  {
    id: 'partnerships',
    icon: 'handshake',
    value: null,
    status: 'pending',
    label: { en: 'Partnerships formed', hi: 'स्थापित साझेदारियाँ' },
    description: {
      en: 'Agreements with institutions, CSR partners and government bodies.',
      hi: 'संस्थाओं, सीएसआर साझेदारों और सरकारी निकायों के साथ समझौते।',
    },
  },
];

export function isPublished(stat: Statistic): stat is Statistic & { value: number } {
  return stat.status === 'published' && typeof stat.value === 'number' && Number.isFinite(stat.value);
}
