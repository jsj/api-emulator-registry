import assert from 'node:assert/strict';
import { createHarness } from '../../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
assert.equal(contract.provider, 'linq');

const numbers = await harness.call('GET', '/v3/phone_numbers', undefined, { authorization: 'Bearer linq_emulator_token' });
assert.equal(numbers.payload.phone_numbers[0].phone_number, '+12025550100');

const created = await harness.call('POST', '/v3/chats', {
  from: '+12025550100',
  to: ['+12025550199'],
  message: { parts: [{ type: 'text', value: 'Hello from smoke.' }] },
}, { 'content-type': 'application/json', authorization: 'Bearer linq_emulator_token' });
assert.equal(created.payload.chat.handles[1].handle, '+12025550199');

const sent = await harness.call('POST', `/v3/chats/${created.payload.chat.id}/messages`, {
  parts: [{ type: 'text', value: 'Second message.' }],
}, { 'content-type': 'application/json', authorization: 'Bearer linq_emulator_token' });
assert.equal(sent.payload.message.parts[0].value, 'Second message.');

const messages = await harness.call('GET', `/v3/chats/${created.payload.chat.id}/messages`);
assert.equal(messages.payload.messages.length, 2);

const subscription = await harness.call('POST', '/v3/webhook_subscriptions', {
  target_url: 'https://example.com/linq-webhook',
  subscribed_events: ['message.sent', 'message.delivered'],
}, { 'content-type': 'application/json' });
assert.match(subscription.payload.signing_secret, /^whsec_linq_emulator_/);

const missing = await harness.call('GET', '/v3/messages/does-not-exist');
assert.equal(missing.status, 404);
assert.equal(missing.payload.error.code, 2001);

console.log('linq smoke ok');
