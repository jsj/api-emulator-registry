import { readFile } from 'node:fs/promises';
import { routeManifest } from '../providers/@xbow/api-emulator.mjs';

const OPENAPI_URL = 'https://docs.xbow.com/api/openapi-2026-08-01.json';
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
// The XBOW API reference documents this route, but its downloadable OpenAPI omits it.
// https://docs.xbow.com/api/ (Lightspeed > Submit Lightspeed request)
const documentedOutsideOpenApi = new Set(['POST /api/v1/integrations/{integrationId}/lightspeed']);
const missing = official.filter((operation) => !implemented.includes(operation));
const extra = implemented.filter((operation) => !official.includes(operation) && !documentedOutsideOpenApi.has(operation));
const missingDocumented = [...documentedOutsideOpenApi].filter((operation) => !implemented.includes(operation));
const failures = [];

if (spec.openapi !== '3.1.0') failures.push(`expected OpenAPI 3.1.0, received ${spec.openapi}`);
if (spec.info?.version !== '2026-08-01') failures.push(`expected version 2026-08-01, received ${spec.info?.version}`);
if (official.length !== 39) failures.push(`expected 39 OpenAPI operations, received ${official.length}`);
if (missing.length) failures.push(`missing operations: ${missing.join(', ')}`);
if (missingDocumented.length) failures.push(`missing documented operations: ${missingDocumented.join(', ')}`);
if (extra.length) failures.push(`extra operations: ${extra.join(', ')}`);

if (failures.length) {
  console.error('XBOW OpenAPI coverage check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`xbow api coverage ok (${official.length} OpenAPI operations, ${documentedOutsideOpenApi.size} documented-only operation)`);
