import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
assert.equal(contract.provider, 'render');

const user = await harness.call('GET', '/v1/users');
assert.equal(user.payload.email, 'ada@example.com');

const owners = await harness.call('GET', '/v1/owners?limit=1');
assert.equal(owners.payload[0].owner.id, 'tea-emulator');
assert.ok(owners.payload[0].cursor);

const services = await harness.call('GET', '/v1/services?ownerId=tea-emulator');
assert.equal(services.payload[0].service.name, 'emulator-web');

const service = await harness.call('GET', '/v1/services/srv-emulator-web');
assert.equal(service.payload.serviceDetails.startCommand, 'npm start');

const created = await harness.call('POST', '/v1/services', {
  name: 'cli-smoke-api',
  type: 'web_service',
  ownerId: 'tea-emulator',
  repo: 'https://github.com/example/cli-smoke-api',
  buildCommand: 'npm ci',
  startCommand: 'node server.js',
});
assert.equal(created.status, 201);
assert.equal(created.payload.name, 'cli-smoke-api');
assert.equal(created.payload.serviceDetails.startCommand, 'node server.js');

const validate = await harness.call('POST', '/v1/blueprints/validate', { services: [] });
assert.equal(validate.payload.valid, true);

console.log('render smoke ok');
