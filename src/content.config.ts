/**
 * Content collections and their rules.
 *
 * Every collection that holds organisational claims has a publication flag. The schemas below
 * stop the build when an entry is marked as public but is missing what makes it verifiable,
 * for example a testimonial without recorded consent or a publication without its PDF.
 * Example entries use "[Replace ...]" text. A public entry that still contains it fails the build.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { iconNames } from './data/icon-names';

const yamlEntries = (folder: string) =>
  glob({ pattern: '**/[!_]*.{yaml,yml}', base: `./src/content/${folder}` });

const localized = z.object({
  en: z.string().trim().min(1),
  hi: z.string().trim().optional(),
});

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens only.');

/** A path to a file inside public/, for example /documents/report.pdf */
const publicPath = z.string().regex(/^\/[^\s]+$/, 'Write the path from the public folder, starting with "/".');

const publicFileExists = (path: string) => existsSync(join(process.cwd(), 'public', decodeURI(path)));

const PLACEHOLDER = /\[replace/i;

function containsPlaceholder(value: unknown): boolean {
  if (typeof value === 'string') return PLACEHOLDER.test(value);
  if (Array.isArray(value)) return value.some(containsPlaceholder);
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.values(value).some(containsPlaceholder);
  }
  return false;
}

type Issue = { code: 'custom'; message: string; path?: PropertyKey[] };
type Context = { addIssue: (issue: Issue) => void };

function rejectPlaceholders(data: unknown, ctx: Context) {
  if (containsPlaceholder(data)) {
    ctx.addIssue({
      code: 'custom',
      path: ['status'],
      message: 'This entry is public but still contains "[Replace ...]" example text. Replace it or keep the entry as a draft.',
    });
  }
}

function requirePublicFile(path: string | undefined, field: string, ctx: Context) {
  if (!path) {
    ctx.addIssue({ code: 'custom', path: [field], message: `A public entry needs "${field}".` });
  } else if (!publicFileExists(path)) {
    ctx.addIssue({ code: 'custom', path: [field], message: `File not found in public${path}. Add the file or fix the path.` });
  }
}

const youtubeId = z.string().regex(/^[A-Za-z0-9_-]{11}$/, 'Use the 11-character YouTube video ID.');

const workAreas = defineCollection({
  loader: yamlEntries('work-areas'),
  schema: z.object({
    order: z.number().int().min(1),
    icon: z.enum(iconNames),
    title: localized,
    summary: localized,
    overview: localized,
    focus: z
      .array(
        z.object({
          id: slug,
          title: localized,
          description: localized,
        }),
      )
      .min(1),
    audiences: z.array(localized).default([]),
    note: localized.optional(),
    cta: z.object({
      label: localized,
      target: z.enum(['partner', 'contact', 'apps', 'research-proposal']),
    }),
    /** Gives the call to action a larger, more visible treatment. */
    prominentCta: z.boolean().default(false),
  }),
});

const leadership = defineCollection({
  loader: yamlEntries('leadership'),
  schema: ({ image }) =>
    z
      .object({
        status: z.enum(['draft', 'published']).default('draft'),
        tier: z.enum(['managing-director', 'board', 'executive']),
        order: z.number().int().default(100),
        name: z.string().trim().min(1),
        designation: localized,
        photo: image().optional(),
        photoAlt: localized.optional(),
        message: localized.optional(),
        bio: localized.optional(),
        background: localized.optional(),
        expertise: localized.optional(),
        linkedin: z.url().optional(),
      })
      .superRefine((entry, ctx) => {
        if (entry.status !== 'published') return;
        rejectPlaceholders(entry, ctx);
        if (entry.photo && !entry.photoAlt) {
          ctx.addIssue({ code: 'custom', path: ['photoAlt'], message: 'Add alt text that describes the photograph.' });
        }
      }),
});

const events = defineCollection({
  loader: yamlEntries('events'),
  schema: ({ image }) =>
    z
      .object({
        status: z.enum(['draft', 'published']).default('draft'),
        /** Set to true only when the date, venue and programme are confirmed. */
        confirmed: z.boolean().default(false),
        title: localized,
        location: localized,
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
        description: localized,
        image: image().optional(),
        imageAlt: localized.optional(),
        registrationUrl: z.url().optional(),
      })
      .superRefine((entry, ctx) => {
        if (entry.status !== 'published') return;
        rejectPlaceholders(entry, ctx);
        if (!entry.confirmed) {
          ctx.addIssue({ code: 'custom', path: ['confirmed'], message: 'Only confirmed events can be published.' });
        }
        if (!entry.startDate) {
          ctx.addIssue({ code: 'custom', path: ['startDate'], message: 'A published event needs a confirmed start date.' });
        }
        if (entry.image && !entry.imageAlt) {
          ctx.addIssue({ code: 'custom', path: ['imageAlt'], message: 'Add alt text for the event image.' });
        }
      }),
});

const galleryCategories = ['training', 'events', 'workshops', 'field-visits', 'meetings', 'entrepreneurship'] as const;

const gallery = defineCollection({
  loader: yamlEntries('gallery'),
  schema: ({ image }) =>
    z
      .object({
        status: z.enum(['draft', 'published']).default('draft'),
        type: z.enum(['photo', 'video']),
        category: z.enum(galleryCategories),
        title: localized,
        caption: localized.optional(),
        date: z.coerce.date().optional(),
        /** The photograph, or the thumbnail of a video. */
        image: image().optional(),
        alt: localized.optional(),
        youtubeId: youtubeId.optional(),
        videoFile: publicPath.optional(),
        /** Confirms that the people shown agreed to publication. */
        consentConfirmed: z.boolean().default(false),
        order: z.number().int().default(100),
      })
      .superRefine((entry, ctx) => {
        if (entry.status !== 'published') return;
        rejectPlaceholders(entry, ctx);
        if (!entry.consentConfirmed) {
          ctx.addIssue({ code: 'custom', path: ['consentConfirmed'], message: 'Confirm consent before publishing media.' });
        }
        if (!entry.image) {
          ctx.addIssue({ code: 'custom', path: ['image'], message: 'Add the photograph or the video thumbnail.' });
        }
        if (!entry.alt) {
          ctx.addIssue({ code: 'custom', path: ['alt'], message: 'Add alt text that describes the image.' });
        }
        if (entry.type === 'video') {
          if (!entry.youtubeId && !entry.videoFile) {
            ctx.addIssue({ code: 'custom', path: ['youtubeId'], message: 'Add a YouTube ID or a video file.' });
          }
          if (entry.videoFile && !publicFileExists(entry.videoFile)) {
            ctx.addIssue({ code: 'custom', path: ['videoFile'], message: `File not found in public${entry.videoFile}.` });
          }
        }
      }),
});

const press = defineCollection({
  loader: yamlEntries('press'),
  schema: z
    .object({
      status: z.enum(['draft', 'published']).default('draft'),
      type: z.enum(['press-release', 'coverage', 'mention', 'announcement']),
      title: localized,
      outlet: z.string().trim().optional(),
      date: z.coerce.date(),
      summary: localized.optional(),
      url: z.url().optional(),
      file: publicPath.optional(),
    })
    .superRefine((entry, ctx) => {
      if (entry.status !== 'published') return;
      rejectPlaceholders(entry, ctx);
      if (!entry.url && !entry.file) {
        ctx.addIssue({ code: 'custom', path: ['url'], message: 'Add the article link or a PDF file.' });
      }
      if (entry.file) requirePublicFile(entry.file, 'file', ctx);
    }),
});

export const publicationCategories = [
  'case-study',
  'sop',
  'policy-paper',
  'research-report',
  'impact-assessment',
  'publication',
  'newsletter',
] as const;

const publications = defineCollection({
  loader: yamlEntries('publications'),
  schema: ({ image }) =>
    z
      .object({
        status: z.enum(['draft', 'published']).default('draft'),
        category: z.enum(publicationCategories),
        title: localized,
        description: localized,
        date: z.coerce.date(),
        thumbnail: image().optional(),
        /** The PDF inside public/, for example /documents/annual-report-2026.pdf */
        file: publicPath.optional(),
        language: z.enum(['en', 'hi', 'bilingual']).default('en'),
      })
      .superRefine((entry, ctx) => {
        if (entry.status !== 'published') return;
        rejectPlaceholders(entry, ctx);
        requirePublicFile(entry.file, 'file', ctx);
      }),
});

export const partnerCategories = ['rsetis', 'banks', 'csr', 'government', 'ngos', 'education', 'other'] as const;

const partners = defineCollection({
  loader: yamlEntries('partners'),
  schema: ({ image }) =>
    z
      .object({
        /** 'verified' only after the partnership is confirmed in writing. */
        status: z.enum(['pending', 'verified']).default('pending'),
        name: z.string().trim().min(1),
        category: z.enum(partnerCategories),
        logo: image().optional(),
        /** true only when the partner has given written permission to show its logo. */
        logoPermission: z.boolean().default(false),
        url: z.url().optional(),
        order: z.number().int().default(100),
      })
      .superRefine((entry, ctx) => {
        if (entry.status !== 'verified') return;
        rejectPlaceholders(entry, ctx);
      }),
});

const testimonials = defineCollection({
  loader: yamlEntries('testimonials'),
  schema: ({ image }) =>
    z
      .object({
        /** 'approved' only when the person has approved the quotation and its use. */
        status: z.enum(['draft', 'approved']).default('draft'),
        /** true for examples that do not describe a real, verified person. These can never be published. */
        illustrative: z.boolean().default(false),
        /** Recorded consent for the name, quotation, photograph and video. */
        consent: z.boolean().default(false),
        name: z.string().trim().min(1),
        role: z.enum(['trainer', 'trainee', 'entrepreneur', 'institution']),
        location: localized.optional(),
        sector: localized.optional(),
        quote: z.object({
          en: z.string().trim().optional(),
          hi: z.string().trim().optional(),
        }),
        photo: image().optional(),
        photoAlt: localized.optional(),
        youtubeId: youtubeId.optional(),
        videoFile: publicPath.optional(),
        featured: z.boolean().default(false),
        order: z.number().int().default(100),
      })
      .superRefine((entry, ctx) => {
        if (entry.status !== 'approved') return;
        rejectPlaceholders(entry, ctx);
        if (entry.illustrative) {
          ctx.addIssue({ code: 'custom', path: ['illustrative'], message: 'Illustrative examples cannot be approved for publication.' });
        }
        if (!entry.consent) {
          ctx.addIssue({ code: 'custom', path: ['consent'], message: 'Record consent before approving a testimonial.' });
        }
        if (!entry.quote.en && !entry.quote.hi) {
          ctx.addIssue({ code: 'custom', path: ['quote'], message: 'Add the approved quotation in English or Hindi.' });
        }
        if (entry.photo && !entry.photoAlt) {
          ctx.addIssue({ code: 'custom', path: ['photoAlt'], message: 'Add alt text for the photograph.' });
        }
        if (entry.videoFile && !publicFileExists(entry.videoFile)) {
          ctx.addIssue({ code: 'custom', path: ['videoFile'], message: `File not found in public${entry.videoFile}.` });
        }
      }),
});

export const careerCategories = [
  'trainers',
  'researchers',
  'consultants',
  'internships',
  'fellowships',
  'programme-operations',
] as const;

const careers = defineCollection({
  loader: yamlEntries('careers'),
  schema: z
    .object({
      status: z.enum(['draft', 'open', 'closed']).default('draft'),
      title: localized,
      category: z.enum(careerCategories),
      department: localized,
      location: localized,
      engagement: z.enum(['full-time', 'part-time', 'contract', 'consultancy', 'internship', 'fellowship']),
      description: localized,
      eligibility: z.array(localized).default([]),
      applyUrl: z.url().optional(),
      applyEmail: z.email().optional(),
      /** Optional closing date. The opening is hidden after this date. */
      deadline: z.coerce.date().optional(),
    })
    .superRefine((entry, ctx) => {
      if (entry.status !== 'open') return;
      rejectPlaceholders(entry, ctx);
      if (!entry.applyUrl && !entry.applyEmail) {
        ctx.addIssue({ code: 'custom', path: ['applyUrl'], message: 'An open role needs applyUrl or applyEmail.' });
      }
    }),
});

const announcements = defineCollection({
  loader: yamlEntries('announcements'),
  schema: z
    .object({
      status: z.enum(['draft', 'published']).default('draft'),
      text: localized,
      /** Internal path such as /media-events/ or a full https link. */
      href: z.string().trim().optional(),
      publishDate: z.coerce.date().optional(),
      expiryDate: z.coerce.date().optional(),
      order: z.number().int().default(100),
    })
    .superRefine((entry, ctx) => {
      if (entry.status !== 'published') return;
      rejectPlaceholders(entry, ctx);
    }),
});

const aboutStatements = defineCollection({
  loader: file('src/content/about/statements.yaml'),
  schema: z.object({
    text: localized,
  }),
});

const story = defineCollection({
  loader: file('src/content/about/story.yaml'),
  schema: z
    .object({
      order: z.number().int(),
      status: z.enum(['draft', 'published']).default('draft'),
      title: localized,
      body: z.object({
        en: z.string().trim().default(''),
        hi: z.string().trim().optional(),
      }),
      /** Shown to editors only. Explains what information this section still needs. */
      editorialNote: z.string().optional(),
    })
    .superRefine((entry, ctx) => {
      if (entry.status !== 'published') return;
      rejectPlaceholders(entry, ctx);
      if (!entry.body.en) {
        ctx.addIssue({ code: 'custom', path: ['body', 'en'], message: 'A published story section needs its English text.' });
      }
    }),
});

const legal = defineCollection({
  loader: glob({ pattern: '**/[!_]*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    locale: z.enum(['en', 'hi']).default('en'),
    lastUpdated: z.coerce.date(),
  }),
});

export const collections = {
  workAreas,
  leadership,
  events,
  gallery,
  press,
  publications,
  partners,
  testimonials,
  careers,
  announcements,
  aboutStatements,
  story,
  legal,
};
