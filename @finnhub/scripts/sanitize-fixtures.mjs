import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROVIDER_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const RAW_DIR = resolve(process.argv[2] ?? join(PROVIDER_DIR, '..', '.emu', 'finnhub', 'raw', 'latest'));
const OUT_PATH = resolve(process.argv[3] ?? join(PROVIDER_DIR, 'fixtures', 'sanitized.json'));
const FIXED_BASE_TIME = 1_714_374_000;

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function safeText(value, fallback = '') {
  const text = String(value ?? fallback)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text || fallback;
}

function tidyText(value, fallback, maxLength) {
  const text = safeText(value, fallback);
  if (text.length <= maxLength) return text;
  const clipped = text.slice(0, maxLength - 1);
  return `${clipped.slice(0, Math.max(0, clipped.lastIndexOf(' '))).trimEnd()}…`;
}

function sanitizeUrl(value, id) {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    return `https://example.com/finnhub/news/${id}`;
  }
}

function sanitizeItem(item, index, defaults = {}) {
  const id = Number(item?.id) || defaults.id || 900000 + index;
  return {
    category: safeText(item?.category, defaults.category ?? 'company news'),
    datetime: FIXED_BASE_TIME - index * 3600,
    headline: tidyText(item?.headline, `${defaults.related ?? 'Market'} emulator headline ${index + 1}`, 180),
    id,
    image: item?.image ? sanitizeUrl(item.image, id) : `https://static.finnhub.io/emulator/news/${id}.jpg`,
    related: safeText(item?.related, defaults.related ?? ''),
    source: safeText(item?.source, 'Finnhub Emulator'),
    summary: tidyText(item?.summary, 'Sanitized Finnhub news fixture.', 500),
    url: item?.url ? sanitizeUrl(item.url, id) : `https://example.com/finnhub/news/${id}`,
  };
}

function firstItems(payload, defaults) {
  const items = Array.isArray(payload) ? payload : [];
  return items.slice(0, 5).map((item, index) => sanitizeItem(item, index, defaults));
}

const fixture = {
  marketNews: {},
  companyNews: {},
};

for (const file of readdirSync(RAW_DIR)) {
  if (!file.endsWith('.json')) continue;
  const payload = readJson(join(RAW_DIR, file));
  if (file.startsWith('news_')) {
    const category = file.replace(/^news_/, '').replace(/\.json$/, '');
    fixture.marketNews[category] = firstItems(payload, { category });
  } else if (file.startsWith('company_news_')) {
    const symbol = file.replace(/^company_news_/, '').replace(/\.json$/, '').toUpperCase();
    fixture.companyNews[symbol] = firstItems(payload, { category: 'company news', related: symbol });
  }
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, `${JSON.stringify(fixture, null, 2)}\n`);
console.log(`wrote sanitized fixture: ${OUT_PATH}`);
