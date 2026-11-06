import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Content queries. Every function returns only what may be shown publicly.
 * Dates are compared with the build date, so rebuild the site regularly (see README).
 */

const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const byOrder = (a: { data: { order: number } }, b: { data: { order: number } }) => a.data.order - b.data.order;

export async function getWorkAreas() {
  return (await getCollection('workAreas')).sort(byOrder);
}

export async function getPublishedLeaders() {
  const leaders = (await getCollection('leadership', ({ data }) => data.status === 'published')).sort(byOrder);
  return {
    managingDirector: leaders.find((entry) => entry.data.tier === 'managing-director'),
    board: leaders.filter((entry) => entry.data.tier === 'board'),
    executive: leaders.filter((entry) => entry.data.tier === 'executive'),
    total: leaders.length,
  };
}

export async function getUpcomingEvents() {
  const today = startOfToday();
  return (
    await getCollection(
      'events',
      ({ data }) =>
        data.status === 'published' &&
        data.confirmed &&
        data.startDate !== undefined &&
        (data.endDate ?? data.startDate) >= today,
    )
  ).sort((a, b) => (a.data.startDate?.getTime() ?? 0) - (b.data.startDate?.getTime() ?? 0));
}

export async function getPublishedGallery() {
  return (await getCollection('gallery', ({ data }) => data.status === 'published' && data.consentConfirmed)).sort(
    (a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0) || a.data.order - b.data.order,
  );
}

export async function getPublishedPress() {
  return (await getCollection('press', ({ data }) => data.status === 'published')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export async function getPublishedPublications(categories?: CollectionEntry<'publications'>['data']['category'][]) {
  return (
    await getCollection(
      'publications',
      ({ data }) => data.status === 'published' && (!categories || categories.includes(data.category)),
    )
  ).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getVerifiedPartners() {
  return (await getCollection('partners', ({ data }) => data.status === 'verified')).sort(byOrder);
}

/** Partners whose logo may be displayed: verified, with written permission and a logo file. */
export async function getDisplayablePartnerLogos() {
  return (await getVerifiedPartners()).filter((entry) => entry.data.logoPermission && entry.data.logo);
}

export async function getApprovedTestimonials() {
  return (
    await getCollection(
      'testimonials',
      ({ data }) => data.status === 'approved' && data.consent && !data.illustrative,
    )
  ).sort((a, b) => Number(b.data.featured) - Number(a.data.featured) || a.data.order - b.data.order);
}

export async function getOpenCareers() {
  const today = startOfToday();
  return (
    await getCollection('careers', ({ data }) => data.status === 'open' && (!data.deadline || data.deadline >= today))
  ).sort((a, b) => (a.data.deadline?.getTime() ?? Infinity) - (b.data.deadline?.getTime() ?? Infinity));
}

export async function getActiveAnnouncements() {
  const today = startOfToday();
  return (
    await getCollection(
      'announcements',
      ({ data }) =>
        data.status === 'published' &&
        (!data.publishDate || data.publishDate <= today) &&
        (!data.expiryDate || data.expiryDate >= today),
    )
  ).sort(byOrder);
}

export async function getStatements() {
  const entries = await getCollection('aboutStatements');
  const find = (id: string) => entries.find((entry) => entry.id === id)?.data.text;
  return { vision: find('vision'), mission: find('mission'), philosophy: find('philosophy') };
}

export async function getStorySections() {
  return (await getCollection('story')).sort(byOrder);
}
