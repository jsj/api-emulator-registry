import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyProviderFidelity } from './conformance/tier.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const catalogPath = join(root, 'api-emulator.catalog.json');
const check = process.argv.includes('--check');
const force = process.argv.includes('--force');
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8')).plugins ?? {};

function allProviders() {
  const slugs = readdirSync(join(root, 'providers'))
    .filter((name) => name.startsWith('@'))
    .map((name) => name.slice(1));

  return slugs.map((slug) => {
    const entry = catalog[slug] ?? {};
    const directModule = `./providers/@${slug}/api-emulator.mjs`;
    const packageModule = `./providers/@${slug}/api-emulator/src/index.ts`;
    const specifier = entry.specifier
      ?? (existsSync(join(root, directModule)) ? directModule : packageModule);
    return [slug, {
      ...entry,
      kind: 'package',
      packageName: entry.packageName ?? `@api-emulator/${slug}`,
      specifier,
    }];
  });
}

function titleize(slug) {
  return slug
    .split('-')
    .map((part) => {
      const upper = new Set(['adp', 'api', 'aws', 'oci', 'sec', 'usaa']);
      if (upper.has(part)) return part.toUpperCase();
      if (part === 'arxiv') return 'arXiv';
      return part[0].toUpperCase() + part.slice(1);
    })
    .join(' ');
}

function readModuleSource(slug, specifier) {
  const candidates = [
    join(root, `providers/@${slug}/api-emulator.mjs`),
    specifier ? join(root, specifier) : null,
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate)) return readFileSync(candidate, 'utf8');
  }
  return '';
}

function routeLines(source) {
  const routes = [];
  const manifest = source.match(/const routeManifest\s*=\s*\[([\s\S]*?)\n\];/)?.[1] ?? '';
  const manifestPattern = /\[['"](GET|POST|PUT|PATCH|DELETE)['"],\s*['"]([^'"]+)['"]\]/g;
  for (const match of manifest.matchAll(manifestPattern)) {
    routes.push(`- \`${match[1]} ${match[2]}\``);
  }
  const routePattern = /app\.(get|post|put|patch|delete)\(\s*['"`]([^'"`]+)['"`]/g;
  for (const match of source.matchAll(routePattern)) {
    routes.push(`- \`${match[1].toUpperCase()} ${match[2]}\``);
  }
  return [...new Set(routes)].slice(0, 40);
}

function authLine(source) {
  if (/authorization|bearer|api[-_ ]?key|x-api-key/i.test(source)) {
    return 'Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.';
  }
  return 'You do not need production credentials. Use fixed local credentials if your client requires them.';
}

function seedBlock(slug) {
  return `\`\`\`yaml\n${slug}:\n  # Add provider-specific seed state here.\n\`\`\``;
}

function fidelityBlock(slug, entry) {
  const fidelity = classifyProviderFidelity(root, slug, entry);
  const explanations = {
    'contract-backed': 'Automated tests compare this emulator with a defined API contract.',
    'smoke-only': 'A smoke test starts the emulator and checks its main behavior.',
    stub: 'This emulator has a small starter API.',
    'generated fallback': 'This emulator has a generated API without direct coverage tests.',
  };
  const lines = [
    `- Level: \`${fidelity.tier}\``,
    `- Meaning: ${explanations[fidelity.tier] ?? 'The repository records the coverage level for this emulator.'}`,
    `- Evidence: ${fidelity.detail}.`,
  ];
  if (fidelity.conformance?.validation?.directSmoke) {
    lines.push(`- Smoke: \`${fidelity.conformance.validation.directSmoke}\``);
  }
  if (fidelity.conformance?.validation?.contractChecks?.length) {
    lines.push(`- Contract checks: ${fidelity.conformance.validation.contractChecks.map((check) => `\`${check}\``).join(', ')}`);
  }
  return lines.join('\n');
}

function readmeFor(slug, entry) {
  const packageName = entry.packageName ?? `@api-emulator/${slug}`;
  const title = packageName.startsWith('@api-emulator/') ? packageName : `@api-emulator/${slug}`;
  const label = titleize(slug);
  const source = readModuleSource(slug, entry.specifier);
  const routes = routeLines(source);
  const endpoints = routes.length ? routes.join('\n') : 'The emulator source lists the supported local API endpoints.';
  const runSpecifier = entry.specifier ?? `./providers/@${slug}/api-emulator.mjs`;
  const officialDocs = source.match(/docs:\s*['"`]([^'"`]+)['"`]/)?.[1];
  const docsLinks = officialDocs
    ? officialDocs.split(/\s*;\s*/).map((url, index, urls) => {
      const label = urls.length === 1 ? 'Official API docs' : `Official API docs ${index + 1}`;
      return `- [${label}](${url})`;
    }).join('\n') + '\n'
    : '';

  return `# ${title}\n\n${entry.description ?? `${label} provides a local API emulator.`}\n\nUse this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.\n\n## Start the emulator\n\n1. Install the package.\n\n\`\`\`bash\nnpm install ${packageName}\n\`\`\`\n\n2. From this registry, start the emulator.\n\n\`\`\`bash\nnpx -p api-emulator api --plugin ${runSpecifier} --service ${slug}\n\`\`\`\n\nThe emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.\n\n## Supported API\n\n${endpoints}\n\n## Coverage\n\n${fidelityBlock(slug, entry)}\n\n## Credentials\n\n${authLine(source)}\n\n## Test data\n\nAdd repeatable test data to the provider configuration.\n\n${seedBlock(slug)}\n\n## Links\n\n${docsLinks}- [api-emulator](https://github.com/jsj/api-emulator)\n`;
}

const stale = [];
let written = 0;

for (const [slug, entry] of allProviders().sort(([a], [b]) => a.localeCompare(b))) {

  const readmePath = join(root, `providers/@${slug}/api-emulator/README.md`);
  const next = readmeFor(slug, entry);
  const current = existsSync(readmePath) ? readFileSync(readmePath, 'utf8') : null;

  if (current === next) continue;
  if (current && !force) continue;

  if (check) {
    stale.push(readmePath);
    continue;
  }

  mkdirSync(dirname(readmePath), { recursive: true });
  writeFileSync(readmePath, next);
  written++;
}

if (check) {
  const missing = allProviders()
    .map(([slug]) => join(root, `providers/@${slug}/api-emulator/README.md`))
    .filter((readmePath) => !existsSync(readmePath));
  if (missing.length || stale.length) {
    console.error(`Provider README check failed: ${missing.length} missing, ${stale.length} stale.`);
    process.exit(1);
  }
} else {
  console.log(`Generated ${written} provider README files.`);
}
