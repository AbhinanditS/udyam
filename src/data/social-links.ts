import { httpsUrl } from '@/utils/urls';

export type SocialPlatform = 'linkedin' | 'youtube' | 'x' | 'facebook' | 'instagram';

/**
 * Official social media accounts. Add the full https link of each confirmed account.
 * Platforms without a link are not shown anywhere on the website.
 */
export const socialLinks: { platform: SocialPlatform; label: string; url: string }[] = [
  { platform: 'linkedin', label: 'LinkedIn', url: '' },
  { platform: 'youtube', label: 'YouTube', url: '' },
  { platform: 'x', label: 'X', url: '' },
  { platform: 'facebook', label: 'Facebook', url: '' },
  { platform: 'instagram', label: 'Instagram', url: '' },
];

/** Only the accounts that have a valid https link. */
export const activeSocialLinks = socialLinks
  .map((link) => ({ ...link, url: httpsUrl(link.url) }))
  .filter((link) => link.url !== '');
