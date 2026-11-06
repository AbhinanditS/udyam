# UdyamSetu Pvt. Ltd. website

The corporate and institutional website of UdyamSetu Pvt. Ltd., in English and Hindi.

- Static site built with Astro 7, TypeScript and Tailwind CSS 4.
- Hosted on Cloudflare Pages (free `pages.dev` address). No server, database, CMS or login system.
- Forms are handled by Tally. Analytics use Cloudflare Web Analytics.
- All content lives in structured files in this repository.

The website shows only verified information. Content that is not yet approved stays hidden, and the
build fails if unverified content is marked as public. See [Publication rules](#publication-rules).

## Contents

- [Run the site locally](#run-the-site-locally)
- [Project structure](#project-structure)
- [Publication rules](#publication-rules)
- [Editing content](#editing-content)
- [Forms (Tally)](#forms-tally)
- [Environment variables](#environment-variables)
- [Deploy to Cloudflare Pages](#deploy-to-cloudflare-pages)
- [Brand, photography and design](#brand-photography-and-design)
- [Content still needed](#content-still-needed)
- [Known limitations](#known-limitations)

## Run the site locally

Requirements: Node.js 22.23.4 or later (see `.node-version`) and npm.

```bash
npm install
```

```bash
npm run dev
```

The site opens at http://localhost:4321. Hindi pages are at http://localhost:4321/hi/.
In development, yellow editorial notes show what content is missing and which file to edit.
These notes never appear in production.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server. |
| `npm run build` | Builds the static site into `dist/`. |
| `npm run preview` | Serves the built site from `dist/`. |
| `npm run check` | Type-checks the project and validates all content files. |
| `npm run lint` | Runs ESLint, including accessibility rules. |
| `npm run check:links` | Checks every internal link and anchor in `dist/`. Run it after a build. |
| `npm run verify` | Runs check, lint, build and the link check in order. Run it before every push. |

## Project structure

```text
public/                  Files served as they are: icons, Open Graph image, PDFs, _headers, _redirects
scripts/check-links.mjs  Internal link checker for the built site
src/
  assets/images/         Optional site photographs (hero, overview)
  components/            Reusable components (layout, ui, home, about, impact, media, forms ...)
  content/               Content collections (YAML and Markdown), one folder per type
  content.config.ts      Content schemas and publication rules
  data/                  Site configuration, navigation, statistics, states, social links
  i18n/                  English (en.ts) and Hindi (hi.ts) interface and page text
  layouts/               Page shell with metadata and structured data
  pages/[...locale]/     Every page, generated once in English (/) and once in Hindi (/hi/)
  scripts/               Small client scripts (menus, carousels, counters, gallery, forms)
  styles/global.css      Design tokens and component styles
```

Every page file in `src/pages/[...locale]/` builds two pages: `/about/` and `/hi/about/`, for example.
Components read the page language from the address, so a new page needs no extra wiring.

## Publication rules

These rules are enforced in `src/content.config.ts`. A build fails with a clear message when an entry breaks them.

| Content | Shown on the website only when |
| --- | --- |
| Leadership profile | `status: published` |
| Event | `status: published`, `confirmed: true` and a `startDate` |
| Testimonial | `status: approved`, `consent: true`, `illustrative: false` and an approved quote |
| Partner | `status: verified`. Its logo shows only with `logoPermission: true` and a logo file |
| Publication | `status: published` and its PDF exists in `public/` |
| Gallery item | `status: published` and `consentConfirmed: true` |
| Vacancy | `status: open`, an application link or email, and a deadline that has not passed |
| Announcement | `status: published` and within its publish and expiry dates |
| Story section (About) | `status: published` |
| Statistic | `status: 'published'` with a number (in `src/data/statistics.ts`) |

Example files contain text in square brackets such as `[Replace with full name]`. A public entry that
still contains `[Replace` fails the build, so placeholder text can never be published by mistake.

Dates are compared with the date of the build. Rebuild the site regularly so expired events,
announcements and vacancies disappear. See [Scheduled rebuilds](#scheduled-rebuilds).

## Editing content

Each content type has a folder in `src/content/`. One file is one entry. The file name becomes its
identifier, so use lowercase words joined by hyphens, for example `meera-sharma.yaml`.

Text that appears in both languages is written as:

```yaml
title:
  en: Training the Trainers
  hi: प्रशिक्षकों का प्रशिक्षण
```

The `hi` value is optional. When it is missing, Hindi pages show the English text, marked with the
correct language and an "Available in English only" label, so languages are never mixed silently.

Images go in the same folder as the YAML file and are referenced with `./file-name.jpg`.
Astro resizes and compresses them at build time. Always add alt text.

### Leadership profiles

Folder: `src/content/leadership/`. There are three example drafts, one per tier.

1. Copy `example-managing-director.yaml`, `example-board-member.yaml` or `example-executive.yaml`.
2. Rename the copy, for example `full-name.yaml`.
3. Set `tier` to `managing-director`, `board` or `executive`. Use `order` to sort within a tier.
4. Fill in `name`, `designation`, `bio`, and `message` (Managing Director), `background` (Board) or
   `expertise` (Executive Board).
5. Put the photograph next to the file, then add `photo: ./full-name.jpg` and `photoAlt`.
6. Set `status: published`.

Executive Board members appear in a carousel. Board members appear in a grid.

### Events

Folder: `src/content/events/`. The three events named in the brief (Bengaluru, Delhi, Jaipur) are
drafts because their dates are not confirmed.

1. Add `startDate: YYYY-MM-DD` and, for multi-day events, `endDate`.
2. Replace the description. Optionally add `image`, `imageAlt` and `registrationUrl`.
3. Set `confirmed: true` and `status: published`.

Past events disappear automatically at the next build.

### Partner logos

Folder: `src/content/partners/`. Copy `example-partner.yaml`.

- Set `status: verified` only after the partnership is confirmed in writing.
- Put the logo file (SVG or PNG) next to the YAML file and add `logo: ./logo-file.svg`.
- Set `logoPermission: true` only when the partner has given written permission to show its logo.
- `category` is one of `rsetis`, `banks`, `csr`, `government`, `ngos`, `education`, `other`.

Verified partners without logo permission are listed by name only. Logos appear on the
Collaborations page, the home page and the footer.

### Publications, reports and newsletters

1. Put the PDF in `public/documents/`, for example `public/documents/research/annual-report-2026.pdf`.
2. Copy `src/content/publications/example-publication.yaml`.
3. Set `category` (`case-study`, `sop`, `policy-paper`, `research-report`, `impact-assessment`,
   `publication` or `newsletter`), `title`, `description`, `date` and
   `file: /documents/research/annual-report-2026.pdf`.
4. Optionally add a cover image as `thumbnail: ./cover.jpg`.
5. Set `status: published`.

Research categories appear in the Research & Knowledge Hub. Newsletters and general publications
appear on the Media & Events page. Download buttons show the file type and size automatically.

### Press releases and media coverage

Folder: `src/content/press/`. Copy `example-press-release.yaml`. Set `type` (`press-release`,
`coverage`, `mention` or `announcement`), `title`, `date`, and either `url` (the article) or `file`
(a PDF in `public/documents/`). Set `status: published`.

### Media gallery

Folder: `src/content/gallery/`. Copy `example-photo.yaml`.

- Photos: `type: photo`, `image: ./photo.jpg`, `alt`, `category`, optional `caption` and `date`.
- Videos: `type: video`, `youtubeId: <11-character ID>` (or `videoFile: /media/file.mp4`), and an
  `image` to use as the thumbnail.
- Set `consentConfirmed: true` only when the people shown agreed to publication, then `status: published`.

The Media & Events page shows the six newest items. "View all media" appears when there are more,
and leads to `/media-events/gallery/` with category filters and a full-screen viewer.

### Testimonials

Folder: `src/content/testimonials/`.

- `rita-devi-illustrative.yaml` is the illustrative example from the brief. It has `illustrative: true`,
  so it can never be published. Do not edit it into a real testimonial; copy it instead.
- For a real testimonial: set `name`, `role` (`trainer`, `trainee`, `entrepreneur` or `institution`),
  `location`, `sector`, the approved quote in `quote.en` and/or `quote.hi`, an optional photo or
  `youtubeId`, then `consent: true`, `illustrative: false` and `status: approved`.
- `featured: true` puts a testimonial first.

Approved testimonials appear on the home page, the Impact page (Beneficiary Speak) and `/testimonials/`.
A quote is shown in its original language when a translation has not been approved.

### State-level impact data

File: `src/data/india-states.ts`. It lists all 28 states and 8 union territories with their
ISO 3166-2 codes. Every record starts as `status: 'pending'`. To publish a state:

```ts
{
  code: 'MH',
  name: { en: 'Maharashtra', hi: 'महाराष्ट्र' },
  type: 'state',
  region: 'west',
  data: {
    status: 'published',
    trainers: 1200,
    beneficiaries: 15000,
    programmes: [{ en: 'Training the Trainers', hi: 'प्रशिक्षकों का प्रशिक्षण' }],
    activity: { en: 'Short verified description.', hi: '...' },
    asOf: '2026-10-31',
    source: { en: 'UdyamSetu programme records' },
  },
},
```

Leave out any field that is not verified. Never estimate figures.

### Statistics and the impact dashboard

File: `src/data/statistics.ts`.

- `headlineStats` holds the three figures from the brief (10,000+ trainers, 1,00,000+ beneficiaries,
  28 states). They appear on the home page and the Impact page.
- `impactIndicators` holds the dashboard: trainers certified, trainees onboarded, CSR projects
  implemented and partnerships formed. They show "verified figure pending" until you add a `value`
  and set `status: 'published'`.
- Add `asOf` and `source` so readers know how current a figure is.

Numbers are formatted in the Indian system (1,00,000) in both languages.

### Careers

Folder: `src/content/careers/`. Copy `example-opening.yaml`, fill in the role, add `applyUrl`
(a Tally form or another page) or `applyEmail`, optionally a `deadline`, then set `status: open`.
When no role is open, the page says there are no current vacancies and shows the expression of interest form.

### Announcements strip

Folder: `src/content/announcements/`. Copy `example-announcement.yaml`, write the text, optionally an
`href` (an internal path such as `/media-events/` or a full link), `publishDate` and `expiryDate`,
then set `status: published`. The strip appears above the home page hero only while an announcement is active.

### About page: vision, mission, story and philosophy

- `src/content/about/statements.yaml` holds the vision, mission and philosophy.
- `src/content/about/story.yaml` holds the "Our story" sections. "The problem we address" and
  "Our approach" were written from the brief and are published. "Why UdyamSetu was established" and
  "Institutional development and growth" are drafts waiting for verified history.

### Work areas

Folder: `src/content/work-areas/`. One file per work area. The file name is the page address, for
example `training-the-trainers.yaml` becomes `/what-we-do/training-the-trainers/`. Each file holds the
title, summary, overview, focus items, audiences, an optional note and the call to action.
`icon` must be a name from `src/data/icon-names.ts`.

### Contact information

File: `src/data/site-config.ts`, section `contact`. Add the postal `address` (English and Hindi),
`email` and `phone`. For the office map, add `map.latitude` and `map.longitude`. The map uses
OpenStreetMap and needs no API key. Missing values are simply not shown.

### Social media accounts

File: `src/data/social-links.ts`. Add the full `https://` link of each official account. Platforms
without a link are hidden everywhere.

### App links and Login

Set these environment variables (see [Environment variables](#environment-variables)):

- `PUBLIC_TRAINER_APP_URL` and `PUBLIC_TRAINEE_APP_URL`: the Google Play listings.
- `PUBLIC_APP_LOGIN_URL`: the web login of the existing Trainer or Trainee application.

Until they are set, the hero buttons, the Login link and the `/apps/` page show "Coming soon".

### Hindi translations

- Interface text and page copy: `src/i18n/en.ts` and `src/i18n/hi.ts`. Both files must have the same
  keys; `npm run check` reports any key missing in Hindi.
- Content entries: add the `hi` value next to each `en` value.
- Organisation names (UdyamSetu Pvt. Ltd., Tally, Google Play) stay in English.
- Legal pages are in English. To add a Hindi version, create `src/content/legal/hi/privacy.md` or
  `src/content/legal/hi/terms.md` with `locale: hi` in the front matter.

All Hindi text in this version was translated for the website and should be reviewed by a native
Hindi editor before launch.

### Legal pages

`src/content/legal/privacy.md` and `src/content/legal/terms.md` are drafts that describe how this
website works (static hosting, Tally forms, Cloudflare Web Analytics, click-to-load videos).
Have them reviewed by legal counsel and add the grievance contact before launch.

### Site photographs

The design works without photographs. To add them:

- Hero: put one photograph (at least 2400 px wide) in `src/assets/images/hero/` and write its alt text
  in `site-config.ts` under `photos.hero.alt`. It replaces the bridge diagram.
- Introduction: put one photograph in `src/assets/images/overview/` and set `photos.overview.alt`.

### CSR Proposal Deck

Put the PDF in `public/documents/` and set `documents.csrProposalDeck` in `site-config.ts`, for example
`'/documents/udyamsetu-csr-proposal-deck.pdf'`. The download button appears only when the file exists.

## Forms (Tally)

Five forms are embedded from Tally. Create each form in Tally (free plan), then copy its share link
(Share > Link, for example `https://tally.so/r/abc123`) into the matching environment variable.

| Form | Variable | Where it appears | Fields to create in Tally |
| --- | --- | --- | --- |
| Contact | `PUBLIC_TALLY_CONTACT_URL` | Contact page | Name, Email, Message |
| Collaboration enquiry | `PUBLIC_TALLY_PARTNERSHIP_URL` | Collaborations page | Organisation, Contact person, Email, Type of collaboration, Message |
| Research proposal | `PUBLIC_TALLY_RESEARCH_URL` | Research page | Name, Organisation, Email, Proposal title, Summary, attachment (optional) |
| Expression of interest | `PUBLIC_TALLY_CAREERS_URL` | Careers page | Name, Email, Area of interest, Experience, CV upload (optional) |
| Newsletter | `PUBLIC_TALLY_NEWSLETTER_URL` | Footer and Events (popup) | Email |

In Tally, mark the required fields as required and use the Email field type for email addresses.
Tally then handles validation and error messages. Write a short thank-you message in Tally as well.

The website listens for Tally's own events: it shows a loading state, a notice with a direct link if the
form loads slowly, and a confirmation when Tally reports a submission. Two optional hidden fields,
`language` and `page`, are passed to every form. Add hidden fields with those names in Tally to record them.

When a variable is not set, the page says the form is not available yet (with the contact email, once
configured). The website never pretends to send a message.

## Environment variables

Copy `.env.example` to `.env` for local development. In production, set them in Cloudflare Pages:
Workers & Pages > your project > Settings > Variables and Secrets. All variables are optional and
none is secret, because they are built into public pages.

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Production address, for example `https://udyamsetu.pages.dev`. Used for canonical URLs, the sitemap and social previews. |
| `PUBLIC_TALLY_CONTACT_URL` | Contact form share link. |
| `PUBLIC_TALLY_PARTNERSHIP_URL` | Collaboration enquiry form share link. |
| `PUBLIC_TALLY_RESEARCH_URL` | Research proposal form share link. |
| `PUBLIC_TALLY_CAREERS_URL` | Expression of interest form share link. |
| `PUBLIC_TALLY_NEWSLETTER_URL` | Newsletter form share link. |
| `PUBLIC_TRAINER_APP_URL` | Trainer App on Google Play. |
| `PUBLIC_TRAINEE_APP_URL` | Trainee App on Google Play. |
| `PUBLIC_APP_LOGIN_URL` | Web login of the existing application. |
| `PUBLIC_CF_WEB_ANALYTICS_TOKEN` | Only if Web Analytics is not enabled from the Pages dashboard. |
| `PUBLIC_SHOW_EDITORIAL_NOTES` | `true` shows editorial notes. Use it for preview deployments only. |
| `PRODUCTION_BRANCH` | Branch deployed to production (default `main`). Other branches get `noindex`. |

Only `https://` links are accepted. Anything else is ignored and treated as not configured.
Changes take effect at the next build.

## Deploy to Cloudflare Pages

No deployment or account has been set up yet. These are the manual steps.

### 1. Create or connect the GitHub repository

The code is in the GitHub repository `AbhinanditS/udyam`. Merge the work into the `main` branch,
which is the production branch.

### 2. Connect the repository to Cloudflare Pages

1. Sign in to the Cloudflare dashboard (a free account is enough).
2. Go to Workers & Pages > Create > Pages > Connect to Git.
3. Authorise GitHub and select the `udyam` repository.

### 3. Configure the build

| Setting | Value |
| --- | --- |
| Project name | `udyamsetu` (this becomes `udyamsetu.pages.dev` if the name is free) |
| Production branch | `main` |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | leave empty |

Cloudflare reads the Node.js version from `.node-version`. Add `SITE_URL` with the final
`https://<project>.pages.dev` address, plus any form and app variables.

### 4. Deploy

Select Save and Deploy. Every push to `main` deploys production. Every other branch and pull request
gets its own preview address. Preview builds add `noindex` and a `robots.txt` that blocks crawling.
To review missing content on previews, add `PUBLIC_SHOW_EDITORIAL_NOTES=true` to the Preview environment only.

No custom domain is needed. If one is added later, update `SITE_URL`.

### 5. Enable Cloudflare Web Analytics

1. Open the Pages project > Metrics.
2. Under Web Analytics, select Enable. Cloudflare adds its script automatically at the next deployment.

Use either this dashboard option or `PUBLIC_CF_WEB_ANALYTICS_TOKEN`, not both, to avoid double counting.
Cloudflare Web Analytics does not use cookies. No other analytics or advertising tracker is included.

### Scheduled rebuilds

Expired events, announcements and vacancies disappear at the next build. To rebuild daily without
a code change, create a Deploy Hook (Pages project > Settings > Builds > Deploy hooks) and call it
on a schedule, for example from a scheduled GitHub Action or a Cloudflare Worker cron trigger.

### Headers and redirects

- `public/_headers` adds security headers and long-term caching for fingerprinted assets.
- `public/_redirects` sends `/en/...` to the English pages and `/favicon.ico` to the PNG icon.
- `dist/404.html` and `dist/hi/404.html` are the English and Hindi "page not found" pages.

## Brand, photography and design

### Temporary logo

The emblem (a tied-arch bridge, "setu", over a gold deck) and the wordmark are a temporary identity
created for this website. They are not the registered brand identity. To replace them:

- Edit `src/components/ui/Emblem.astro` and `src/components/ui/Logo.astro`.
- Replace `public/favicon.svg`, `public/favicon-32.png`, `public/apple-touch-icon.png`,
  `public/icon-192.png`, `public/icon-512.png` and `public/brand/udyamsetu-emblem-512.png`.
- Replace the social preview image `public/og/udyamsetu-og.png` (1200 x 630).

### Photography direction

Use licensed photographs of real UdyamSetu programmes, with recorded consent of the people shown:
natural light, eye level, people shown as skilled participants at work, in training or running their
enterprises. Avoid staged poverty imagery, heavy filters and stock photographs presented as UdyamSetu programmes.

### Design system

Tokens are in `src/styles/global.css`: a warm canvas, white cards with a light border and shadow,
deep navy for structure, gold reserved for impact figures and the main call to action, and green for
verified states. Text uses Lato with Noto Sans Devanagari for Hindi and IBM Plex Mono for labels.
Fonts are self-hosted from npm packages. Motion is limited to short, one-time reveals and counters,
and is switched off for visitors who prefer reduced motion.

## Content still needed

| Item | Where it goes |
| --- | --- |
| Official logo | `Emblem.astro`, `Logo.astro`, icons in `public/` |
| Corporate office address, email, phone, map coordinates | `src/data/site-config.ts` |
| Official social media accounts | `src/data/social-links.ts` |
| Tally forms (five) | Environment variables |
| Play Store links and app login address | Environment variables |
| Managing Director, Board and Executive Board profiles and photographs | `src/content/leadership/` |
| Founding history and institutional milestones | `src/content/about/story.yaml` |
| Confirmation that the headline figures are current and achieved | `src/data/statistics.ts` |
| Verified dashboard indicators and state-level data | `src/data/statistics.ts`, `src/data/india-states.ts` |
| Event dates and confirmations | `src/content/events/` |
| Approved testimonials with consent | `src/content/testimonials/` |
| Verified partners and logo permissions | `src/content/partners/` |
| Publications, reports and the CSR Proposal Deck (PDF) | `public/documents/`, `src/content/publications/` |
| Photographs with consent | `src/assets/images/`, gallery |
| Hindi review by a native editor | `src/i18n/hi.ts`, content files |
| Legal review of the privacy policy and terms | `src/content/legal/` |

## Known limitations

- The interactive India map is deferred. The Impact page has a state and union territory selector
  and a full table that read `src/data/india-states.ts`. A map component can use the same file later.
- Time-based content (events, announcements, vacancies) updates only when the site is rebuilt.
- Tally forms load from tally.so. Visitors who block third-party frames see a link to open the form directly.
- The site has no search, because the content volume does not need it yet.
