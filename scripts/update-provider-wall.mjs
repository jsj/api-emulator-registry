import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyProviderFidelity } from './conformance/tier.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const readmePath = join(root, 'README.md');
const configPath = join(root, 'scripts/provider-wall.json');
const check = process.argv.includes('--check');

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const catalog = JSON.parse(readFileSync(join(root, 'api-emulator.catalog.json'), 'utf8')).plugins ?? {};
const providersRoot = join(root, 'providers');
const domains = config.domains ?? {};
const names = config.names ?? {};

function titleize(slug) {
  return slug
    .split('-')
    .map((part) => {
      if (part.length <= 3) return part.toUpperCase();
      return part[0].toUpperCase() + part.slice(1);
    })
    .join(' ');
}

function readLabel(slug) {
  if (names[slug]) return names[slug];
  return titleize(slug);
}

function inferDomain(slug) {
  if (domains[slug]) return domains[slug];
  if (slug.startsWith('apple-')) return 'apple.com';
  if (slug.startsWith('google-')) return 'google.com';
  return `${slug.replaceAll('-', '')}.com`;
}

function providerPaths(slug) {
  const dir = join(root, `providers/@${slug}`);
  const nested = join(dir, 'api-emulator');
  return {
    dir,
    readme: existsSync(join(nested, 'README.md')) ? join(nested, 'README.md') : null,
    rootReadme: existsSync(join(dir, 'README.md')) ? join(dir, 'README.md') : null,
    module: existsSync(join(dir, 'api-emulator.mjs')) ? join(dir, 'api-emulator.mjs') : null,
    packageJson: existsSync(join(nested, 'package.json')) ? join(nested, 'package.json') : null,
  };
}

function providerLink(slug, paths) {
  if (paths.readme) return `./providers/@${slug}/api-emulator/README.md`;
  if (paths.rootReadme) return `./providers/@${slug}/README.md`;
  if (paths.module) return `./providers/@${slug}/api-emulator.mjs`;
  return `./providers/@${slug}/api-emulator/package.json`;
}

function readiness(slug, entry) {
  const fidelity = classifyProviderFidelity(root, slug, entry);
  const rank = {
    'contract-backed': 0,
    'smoke-only': 1,
    'generated fallback': 2,
    stub: 3,
  }[fidelity.tier] ?? 4;
  return { rank, score: fidelity.score ?? 0 };
}

function compactDescription(description, label) {
  let text = description.replace(/\.$/, '');
  const providerAction = text.match(/^.+?\s+(?:provide|provides)\s+(.+)$/i);
  if (providerAction) text = providerAction[1];

  const platformPurpose = text.match(/^(?:an?\s+)?[^.]+?\s+for\s+(.+)$/i);
  if (!providerAction && platformPurpose) text = platformPurpose[1];

  text = text
    .replace(/^APIs?\s+for\s+/i, '')
    .replace(/\s+APIs?\s+for\s+/i, ': ')
    .replace(/^a local API emulator$/i, 'Local API');

  const words = text.split(/\s+/);
  if (words.length > 14 && text.includes(',')) {
    const items = text.split(',').map((item) => item.trim());
    text = `${items.slice(0, 4).join(', ')}, and more`;
  }

  if (!text || text.toLowerCase() === label.toLowerCase()) return 'Local API';
  return `${text[0].toUpperCase()}${text.slice(1)}.`;
}

const providers = readdirSync(providersRoot)
  .filter((name) => name.startsWith('@'))
  .map((name) => name.slice(1))
  .filter((slug) => statSync(join(root, `providers/@${slug}`)).isDirectory())
  .map((slug) => {
    const paths = providerPaths(slug);
    if (!paths.readme && !paths.rootReadme && !paths.module && !paths.packageJson) return null;
    const label = readLabel(slug);
    const domain = inferDomain(slug);
    const entry = catalog[slug] ?? {};
    const providerReadiness = readiness(slug, entry);
    return {
      slug,
      label,
      link: providerLink(slug, paths),
      icon: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`,
      packageName: entry.packageName ?? `@api-emulator/${slug}`,
      description: compactDescription(entry.description ?? `${label} provides a local API emulator.`, label),
      readinessRank: providerReadiness.rank,
      coverageScore: providerReadiness.score,
    };
  })
  .filter(Boolean)
  .sort((a, b) =>
    a.readinessRank - b.readinessRank
      || b.coverageScore - a.coverageScore
      || a.label.localeCompare(b.label));

const table = [
  '<!-- provider-wall:start -->',
  '| Logo | Provider | Package | What it emulates |',
  '| --- | --- | --- | --- |',
  ...providers.map(
    (provider) =>
      `| <img src="${provider.icon}" width="32" height="32" alt=""> | [${provider.label}](${provider.link}) | \`${provider.packageName}\` | ${provider.description} |`,
  ),
  '',
  "Don't see the service you need? [Open a provider request](https://github.com/jsj/api-emulator-registry/issues/new?template=provider.yml).",
  '<!-- provider-wall:end -->',
].join('\n');

const readme = readFileSync(readmePath, 'utf8');
let replaced = false;
const next = readme.replace(
  /## (?:Provider wall|Providers)\n\n(?:(?:Browse the providers|Providers with|Test coverage)[^\n]*\n\n)?<!-- provider-wall:start -->\n[\s\S]*?<!-- provider-wall:end -->\n?/,
  () => {
    replaced = true;
    return `## Providers\n\n${table}\n`;
  },
);

if (!replaced) {
  throw new Error('Could not find Provider wall table in README.md');
}

if (check) {
  if (next !== readme) {
    console.error('README.md provider wall is stale. Run: npm run provider-wall');
    process.exit(1);
  }
} else {
  writeFileSync(readmePath, next);
  console.log(`Updated provider wall with ${providers.length} providers.`);
}
