import { readFile } from 'node:fs/promises';
import { routeManifest } from '../@xbow/api-emulator.mjs';

const OPENAPI_URL = 'https://docs.xbow.com/api/openapi-2026-07-01.json';
const methods = new Set(['get', 'post', 'put', 'patch', 'delete']);

async function loadOpenApi() {
  if (process.env.XBOW_OPENAPI_PATH) return JSON.parse(await readFile(process.env.XBOW_OPENAPI_PATH, 'utf8'));
  const response = await fetch(OPENAPI_URL);
  if (!response.ok) throw new Error(`Failed to fetch XBOW OpenAPI schema: ${response.status}`);
  return response.json();
}

const spec = await loadOpenApi();
const official = Object.entries(spec.paths).flatMap(([path, item]) =>
  Object.keys(item).filter((method) => methods.has(method)).map((method) => `${method.toUpperCase()} ${path}`),
).sort();
const implemented = routeManifest.map(([method, path]) => `${method} ${path}`).sort();
const missing = official.filter((operation) => !implemented.includes(operation));
const extra = implemented.filter((operation) => !official.includes(operation));
const failures = [];

if (spec.openapi !== '3.1.0') failures.push(`expected OpenAPI 3.1.0, received ${spec.openapi}`);
if (spec.info?.version !== '2026-07-01') failures.push(`expected version 2026-07-01, received ${spec.info?.version}`);
if (official.length !== 40) failures.push(`expected 40 official operations, received ${official.length}`);
if (missing.length) failures.push(`missing operations: ${missing.join(', ')}`);
if (extra.length) failures.push(`extra operations: ${extra.join(', ')}`);

if (failures.length) {
  console.error('XBOW OpenAPI coverage check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`xbow openapi coverage ok (${implemented.length}/${official.length} operations)`);
