// Checks every internal link, image and script reference in the built site (dist/).
// Run after `npm run build`: npm run check:links
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
if (!existsSync(dist)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const htmlFiles = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith('.html')) htmlFiles.push(path);
  }
};
walk(dist);

const ids = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  ids.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

const resolveTarget = (pathname) => {
  const clean = decodeURIComponent(pathname);
  const candidates = [join(dist, clean), join(dist, clean, 'index.html')];
  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
};

const problems = [];
let checked = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const page = '/' + relative(dist, file).replace(/index\.html$/, '');
  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(value)) continue;
    checked += 1;
    const url = new URL(value, `https://site.local${page}`);
    const target = url.pathname === page && value.startsWith('#') ? file : resolveTarget(url.pathname);
    if (!target) {
      problems.push(`${page} -> ${value} (missing page or file)`);
      continue;
    }
    if (url.hash && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (id && !ids.get(target)?.has(id)) problems.push(`${page} -> ${value} (missing #${id})`);
    }
  }
}

if (problems.length > 0) {
  console.error(`Found ${problems.length} broken internal reference(s):`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.log(`Checked ${checked} internal references in ${htmlFiles.length} pages. No broken links.`);
