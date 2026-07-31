import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin, routeManifest } from './api-emulator.mjs';

const harness = createHarness(plugin);
const headers = { Authorization: 'Bearer xbt_emulator', 'X-XBOW-API-Version': '2026-07-01' };
const call = (method, path, body) => harness.call(method, path, body, headers);
const ORG = '123e4567-e89b-12d3-a456-426614174001';
const ASSET = '123e4567-e89b-12d3-a456-426614174002';
const ASSESSMENT = '123e4567-e89b-12d3-a456-426614174003';
const FINDING = '123e4567-e89b-12d3-a456-426614174004';
const REPORT = '123e4567-e89b-12d3-a456-426614174005';
const RESOURCE = '123e4567-e89b-12d3-a456-426614174006';
const WEBHOOK = '123e4567-e89b-12d3-a456-426614174007';
const KEY = '123e4567-e89b-12d3-a456-426614174008';

assert.equal(contract.provider, 'xbow');
assert.equal(contract.operations, 40);
assert.equal(routeManifest.length, 40);
for (const [method, path] of routeManifest) {
  const registeredPath = path.replaceAll(/{([^}]+)}/g, ':$1');
  assert.ok(harness.app.routes.some((route) => route.method === method && route.path === registeredPath), `missing ${method} ${path}`);
}

assert.equal((await harness.call('GET', `/api/v1/assets/${ASSET}`)).status, 401);
assert.equal((await harness.call('GET', `/api/v1/assets/${ASSET}`, undefined, { Authorization: 'Bearer x' })).status, 400);
assert.equal((await call('GET', '/api/v1/meta/addresses')).payload.agents.length, 2);
assert.equal(Object.keys((await call('GET', '/api/v1/meta/openapi.json')).payload.paths).length, 29);
assert.equal((await call('GET', '/api/v1/meta/webhooks-signing-keys')).payload.length, 1);

assert.equal((await call('GET', `/api/v1/organizations/${ORG}`)).payload.state, 'active');
assert.equal((await call('PUT', `/api/v1/organizations/${ORG}`, { externalId: 'org-updated', name: 'Updated Org' })).payload.name, 'Updated Org');
assert.equal((await call('GET', '/api/v1/integrations/int-1/organizations')).payload.items.length, 1);
const newOrg = await call('POST', '/api/v1/integrations/int-1/organizations', { externalId: 'customer-2', members: [{ email: 'security@example.test' }], name: 'Customer Two' });
assert.equal(newOrg.payload.externalId, 'customer-2');
assert.equal((await call('POST', '/api/v1/integrations/int-1/lightspeed', { asset: { name: 'App', startUrl: 'https://app.example.test' }, organizationId: ORG })).status, 202);

assert.equal((await call('GET', `/api/v1/organizations/${ORG}/assets`)).payload.items[0].id, ASSET);
const createdAsset = await call('POST', `/api/v1/organizations/${ORG}/assets`, { name: 'New target', sku: 'standard-sku' });
assert.equal(createdAsset.status, 201);
assert.equal((await call('GET', `/api/v1/assets/${ASSET}`)).payload.sku, 'standard-sku');
const currentAsset = (await call('GET', `/api/v1/assets/${ASSET}`)).payload;
const updatedAsset = await call('PUT', `/api/v1/assets/${ASSET}`, {
  approvedTimeWindows: null, authorizationHeaderDomains: 'attackable', credentials: null, customHeaderDomains: 'attackable', dnsBoundaryRules: null,
  headers: null, httpBoundaryRules: null, maxRequestsPerSecond: null, name: 'Updated target', startUrl: null, sku: currentAsset.sku,
});
assert.equal(updatedAsset.payload.name, 'Updated target');

assert.equal((await call('GET', `/api/v1/assets/${ASSET}/assessments`)).payload.items[0].id, ASSESSMENT);
const createdAssessment = await call('POST', `/api/v1/assets/${ASSET}/assessments`, { attackCredits: 20 });
assert.equal(createdAssessment.payload.attackCredits, 20);
assert.equal((await call('GET', `/api/v1/assessments/${ASSESSMENT}`)).payload.state, 'waiting-for-capacity');
assert.equal((await call('POST', `/api/v1/assessments/${ASSESSMENT}/pause`)).payload.state, 'paused');
assert.equal((await call('POST', `/api/v1/assessments/${ASSESSMENT}/resume`)).payload.state, 'waiting-for-capacity');
assert.equal((await call('POST', `/api/v1/assessments/${ASSESSMENT}/cancel`)).payload.state, 'cancelling');

assert.equal((await call('GET', `/api/v1/assets/${ASSET}/findings`)).payload.items[0].id, FINDING);
assert.equal((await call('GET', `/api/v1/findings/${FINDING}`)).payload.cwe, 'CWE-79');
const patchedFinding = await call('PATCH', `/api/v1/findings/${FINDING}`, { externalTicketReference: 'SEC-42', externalWorkflowState: 'in-progress' });
assert.equal(patchedFinding.payload.externalTicketReference, 'SEC-42');
assert.match((await call('POST', `/api/v1/findings/${FINDING}/verify-fix`)).payload.name, /^Fix Verification/);

assert.equal((await call('GET', `/api/v1/assets/${ASSET}/reports`)).payload.items[0].id, REPORT);
assert.equal((await call('GET', `/api/v1/reports/${REPORT}`)).headers['Content-Type'], 'application/pdf');
assert.match((await call('GET', `/api/v1/reports/${REPORT}/summary`)).payload.markdown, /XBOW/);

assert.equal((await call('GET', `/api/v1/organizations/${ORG}/resources`)).payload.items[0].id, RESOURCE);
assert.equal((await call('GET', `/api/v1/resources/${RESOURCE}`)).payload.status, 'initiated');
const parts = await call('POST', `/api/v1/resources/${RESOURCE}/parts`, { parts: [1, 2] });
assert.equal(parts.payload.parts.length, 2);
assert.equal((await call('POST', `/api/v1/resources/${RESOURCE}/commit`, { parts: [{ eTag: 'etag-1', partNumber: 1 }], sha256: 'abc123' })).payload.status, 'processing');
const newResource = await call('POST', `/api/v1/organizations/${ORG}/resources`, { fileName: 'docs.pdf', name: 'Documentation', type: 'documentation' });
assert.equal(newResource.status, 201);
assert.equal((await call('DELETE', `/api/v1/resources/${newResource.payload.id}`)).payload.status, 'deleted');

assert.equal((await call('GET', `/api/v1/organizations/${ORG}/webhooks`)).payload.items[0].id, WEBHOOK);
assert.equal((await call('GET', `/api/v1/webhooks/${WEBHOOK}`)).payload.id, WEBHOOK);
assert.equal((await call('PATCH', `/api/v1/webhooks/${WEBHOOK}`, { targetUrl: 'https://new.example.test/hook' })).payload.targetUrl, 'https://new.example.test/hook');
assert.equal((await call('POST', `/api/v1/webhooks/${WEBHOOK}/ping`)).status, 204);
assert.equal((await call('GET', `/api/v1/webhooks/${WEBHOOK}/deliveries`)).payload.items[0].payload.type, 'ping');
const newWebhook = await call('POST', `/api/v1/organizations/${ORG}/webhooks`, { apiVersion: '2026-07-01', events: ['finding.changed'], targetUrl: 'https://events.example.test' });
assert.equal(newWebhook.status, 201);
assert.equal((await call('DELETE', `/api/v1/webhooks/${newWebhook.payload.id}`)).status, 204);

const newKey = await call('POST', `/api/v1/organizations/${ORG}/keys`, { expiresInMinutes: 30, name: 'CI key' });
assert.match(newKey.payload.key, /^xbt_emulator_/);
assert.equal((await call('DELETE', `/api/v1/keys/${newKey.payload.id}`)).status, 204);
assert.equal((await call('DELETE', `/api/v1/keys/${KEY}`)).status, 204);

assert.equal((await call('GET', '/api/v1/assets/missing')).status, 404);
console.log('xbow full-contract smoke ok');
