import type { ImageMetadata } from 'astro';

/**
 * Optional site photographs. Drop one image file into the matching folder in src/assets/images/
 * and it is used automatically, optimised and resized at build time.
 */
type ImageModule = { default: ImageMetadata };

const hero = import.meta.glob<ImageModule>('/src/assets/images/hero/*.{jpg,jpeg,png,webp,avif}', { eager: true });
const overview = import.meta.glob<ImageModule>('/src/assets/images/overview/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

const first = (modules: Record<string, ImageModule>): ImageMetadata | null => {
  const key = Object.keys(modules).sort()[0];
  return key ? (modules[key]?.default ?? null) : null;
};

export const sitePhotos = {
  hero: first(hero),
  overview: first(overview),
};
