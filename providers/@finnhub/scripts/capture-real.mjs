import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROVIDER_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const REGISTRY_DIR = dirname(PROVIDER_DIR);
const RAW_ROOT = join(REGISTRY_DIR, '.emu', 'finnhub', 'raw');
const RAW_DIR = join(RAW_ROOT, new Date().toISOString().replace(/[:.]/g, '-'));
const LATEST_DIR = join(RAW_ROOT, 'latest');
const TOKEN = process.env.FINNHUB_API_KEY;
const BASE_URL = process.env.FINNHUB_BASE_URL ?? 'https://finnhub.io/api/v1';
const CATEGORIES = (process.env.FINNHUB_FIXTURE_CATEGORIES ?? 'general,forex,crypto,merger').split(',').map((value) => value.trim()).filter(Boolean);
const SYMBOLS = (process.env.FINNHUB_FIXTURE_SYMBOLS ?? 'AAPL,MSFT').split(',').map((value) => value.trim().toUpperCase()).filter(Boolean);

if (!TOKEN) {
  throw new Error('Set FINNHUB_API_KEY in your shell. The script never writes the key to repo files.');
}

function writeCapture(name, payload) {
  writeFileSync(join(RAW_DIR, `${name}.json`), `${JSON.stringify(payload, null, 2)}\n`);
  writeFileSync(join(LATEST_DIR, `${name}.json`), `${JSON.stringify(payload, null, 2)}\n`);
}

async function call(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const response = await fetch(url, { headers: { 'X-Finnhub-Token': TOKEN } });
  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }
  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}: ${typeof payload === 'string' ? payload : JSON.stringify(payload)}`);
  }
  return payload;
}

mkdirSync(RAW_DIR, { recursive: true });
rmSync(LATEST_DIR, { recursive: true, force: true });
mkdirSync(LATEST_DIR, { recursive: true });

console.log('Capturing Finnhub market/company news into .emu/. Do not commit raw captures.');
for (const category of CATEGORIES) {
  console.log(`capturing news_${category}`);
  writeCapture(`news_${category}`, await call('/news', { category }));
}

const today = new Date().toISOString().slice(0, 10);
const from = process.env.FINNHUB_FIXTURE_FROM ?? '2025-05-15';
const to = process.env.FINNHUB_FIXTURE_TO ?? today;
for (const symbol of SYMBOLS) {
  console.log(`capturing company_news_${symbol}`);
  writeCapture(`company_news_${symbol}`, await call('/company-news', { symbol, from, to }));
}

await import('./sanitize-fixtures.mjs');
console.log(`raw capture: ${RAW_DIR}`);
console.log('sanitized fixture updated. Review @finnhub/fixtures/sanitized.json before committing.');
