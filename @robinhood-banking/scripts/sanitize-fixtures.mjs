import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const PROVIDER_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const REGISTRY_DIR = dirname(PROVIDER_DIR);
const RAW_DIR = resolve(process.argv[2] ?? join(REGISTRY_DIR, '.api-emu', 'robinhood-banking', 'raw', 'latest'));
const OUT_PATH = resolve(process.argv[3] ?? join(PROVIDER_DIR, 'fixtures', 'captured-shape.sanitized.json'));
const syntheticIds = new Map();

function readJson(path) {
  const raw = readFileSync(path, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return vm.runInNewContext(`(${raw})`, {}, { timeout: 1000 });
  }
}

function parseMaybeJson(value) {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function parseLeadingJson(value) {
  const input = value.trim();
  if (!input.startsWith('{') && !input.startsWith('[')) return parseMaybeJson(value);
  const stack = [];
  let inString = false;
  let escaped = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (inString) {
      escaped = char === '\\' && !escaped;
      if (char === '"' && !escaped) inString = false;
      if (char !== '\\') escaped = false;
      continue;
    }
    if (char === '"') inString = true;
    if (char === '{' || char === '[') stack.push(char);
    if (char === '}' || char === ']') {
      stack.pop();
      if (stack.length === 0) return parseMaybeJson(input.slice(0, index + 1));
    }
  }
  return parseMaybeJson(value);
}

function structuredPayload(raw) {
  const result = raw?.result ?? raw;
  if (result?.structuredContent !== undefined) return result.structuredContent;
  const text = result?.content?.find?.((block) => block?.type === 'text' && typeof block.text === 'string')?.text;
  return typeof text === 'string' ? parseLeadingJson(text) : parseMaybeJson(raw);
}

function syntheticId(value, prefix) {
  const key = `${prefix}:${value}`;
  if (!syntheticIds.has(key)) syntheticIds.set(key, `${prefix}_${String(syntheticIds.size + 1).padStart(3, '0')}`);
  return syntheticIds.get(key);
}

function sanitizeString(key, value) {
  const lower = key.toLowerCase();
  const normalized = lower.replace(/[^a-z0-9]/g, '');
  if (lower.includes('email')) return 'agent@example.com';
  if (lower.includes('phone')) return '+15555550100';
  if (lower.includes('cvv') || lower.includes('cvc') || lower.includes('security_code')) return '123';
  if (normalized.includes('cardnumber') || lower === 'pan' || lower.endsWith('_pan')) return '4242424242424242';
  if (lower === 'last4' || lower.endsWith('_last4')) return '4242';
  if (lower.includes('zip') || lower.includes('postal')) return '94105';
  if (lower.includes('street') || lower.includes('address')) return '1 Market St';
  if (lower.includes('locality') || lower === 'city') return 'San Francisco';
  if (lower.includes('subdivision') || lower === 'state') return 'CA';
  if (lower.includes('name')) return lower.includes('merchant') ? 'Example Merchant' : 'Example User';
  if (lower === 'id' || lower.endsWith('_id') || lower.includes('token') || lower.includes('identifier')) {
    return syntheticId(value, lower.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'id');
  }
  return value
    .replace(/\b\d{13,19}\b/g, '4242424242424242')
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, 'agent@example.com')
    .replace(/\+?1?[-.\s(]*\d{3}[-.\s)]*\d{3}[-.\s]*\d{4}\b/g, '+15555550100');
}

function sanitizeNumber(key, value) {
  const lower = key.toLowerCase();
  if (lower.includes('amount') || lower.includes('limit') || lower.includes('balance')) return 42.5;
  if (lower.includes('cvv') || lower.includes('cvc')) return 123;
  if (lower.includes('month')) return 12;
  if (lower.includes('year')) return 2030;
  return value;
}

function sanitize(value, key = '') {
  if (Array.isArray(value)) return value.map((item) => sanitize(item, key));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => [entryKey, sanitize(entryValue, entryKey)]));
  }
  if (typeof value === 'string') return sanitizeString(key, value);
  if (typeof value === 'number') return sanitizeNumber(key, value);
  return value;
}

function loadTools() {
  return Object.fromEntries(
    readdirSync(RAW_DIR)
      .filter((file) => file.endsWith('.json'))
      .sort()
      .map((file) => {
        const tool = basename(file, '.json');
        return [tool, sanitize(structuredPayload(readJson(join(RAW_DIR, file))))];
      }),
  );
}

const sanitized = {
  source: {
    provider: 'robinhood-banking',
    sanitizedAt: new Date().toISOString(),
  },
  tools: loadTools(),
};

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, `${JSON.stringify(sanitized, null, 2)}\n`);
console.log(`wrote sanitized fixture: ${OUT_PATH}`);
