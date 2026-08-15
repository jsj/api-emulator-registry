import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createApp, Store, withServer } from '../../scripts/cli-smoke-runtime.mjs';
import { plugin } from './api-emulator.mjs';

const spec = JSON.parse(await readFile(new URL('./apple-ads-platform-api-v1.openapi.json', import.meta.url), 'utf8'));
const documented = new Set();

for (const [path, pathItem] of Object.entries(spec.paths)) {
  for (const method of Object.keys(pathItem)) {
    documented.add(`${method.toUpperCase()} /v1${path}`);
  }
}

const app = createApp();
plugin.register(app, new Store());
const implemented = new Set(
  app.routes
    .filter((route) => route.path.startsWith('/v1/'))
    .map((route) => `${route.method.toUpperCase()} ${route.path.replace(/:([^/]+)/g, '{$1}')}`),
);

assert.deepEqual([...implemented].sort(), [...documented].sort());
assert.equal(documented.size, 104);
assert.equal(new Set([...documented].map((item) => item.split(' ')[0])).size, 4);

const fixtureIDs = [
  ['/apps/', '999999999'],
  ['/campaigns/', '444555666'],
  ['/adgroups/', '555666777'],
  ['/keywords/', '888999000'],
  ['/negative-keywords/', '888999100'],
  ['/ads/', '777888999'],
  ['/shared-budgets/', '777890001'],
  ['/creatives/', '666777888'],
  ['/assets/', 'asset-iphone-1'],
  ['/business-brands/', 'brand-12345678'],
  ['/business-categories/', 'TRAVEL'],
  ['/location-groups/', '333444555'],
  ['/locations/', 'geo-us-nyc'],
  ['/product-pages/', 'product-page-671'],
  ['/rejection-reasons/apps/', '1111111'],
  ['/ad-accounts/', '123456789'],
  ['/orgs/', '987654321'],
];

function fixturePath(path) {
  if (path.includes('{detailId}')) return path.replace('{detailId}', 'Campaign.444555666.txn_abc123def456');
  const entry = fixtureIDs.find(([prefix]) => path.startsWith(prefix));
  return path.replace('{id}', entry?.[1] ?? '1');
}

await withServer(app, async (baseUrl) => {
  const servedSpec = await (await fetch(`${baseUrl}/openapi.json`)).json();
  assert.deepEqual(servedSpec.paths, spec.paths);
  const auth = await (await fetch(`${baseUrl}/auth/local`, { method: 'POST' })).json();
  const headers = {
    authorization: `Bearer ${auth.accessToken}`,
    'x-ap-context': `adAccountId=${auth.adAccountId}`,
    'content-type': 'application/json',
  };
  for (const operation of [...documented].sort()) {
    const [method, documentedPath] = operation.split(' ');
    const request = { method, headers };
    if (method === 'POST' || method === 'PUT') request.body = '{}';
    const response = await fetch(`${baseUrl}/v1${fixturePath(documentedPath.slice(3))}`, request);
    assert.ok(response.status >= 200 && response.status < 300, `${operation} returned HTTP ${response.status}`);
    const payload = await response.json();
    assert.ok(Object.hasOwn(payload, 'result'), `${operation} omitted result`);
    assert.ok(Object.hasOwn(payload, 'error'), `${operation} omitted error`);
  }
});

console.log(`apple-ads OpenAPI coverage ok: ${documented.size} operations`);
