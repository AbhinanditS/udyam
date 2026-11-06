import type { APIRoute } from 'astro';

/** Preview deployments ask search engines not to crawl. Production lists the sitemap. */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site ?? 'https://udyamsetu.pages.dev').toString();
  const body = __PREVIEW_BUILD__
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
