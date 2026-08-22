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
  message: { parts: [{ type: 'text', value: 'Second message.' }] },
}, { 'content-type': 'application/json', authorization: 'Bearer linq_emulator_token' });
assert.equal(sent.status, 202);
assert.equal(sent.payload.message.parts[0].value, 'Second message.');

const automatic = await harness.call('POST', '/api/partner/v3/messages', {
  to: ['+12025550177'],
  message: { parts: [{ type: 'text', value: 'Automatic line selection.' }], idempotency_key: 'fives:daily:1' },
}, { 'content-type': 'application/json', authorization: 'Bearer linq_emulator_token' });
assert.equal(automatic.status, 202);
assert.equal(automatic.payload.from, '+12025550100');
assert.equal(automatic.payload.created_new_chat, true);
assert.equal(automatic.payload.message.parts[0].value, 'Automatic line selection.');
const replay = await harness.call('POST', '/api/partner/v3/messages', {
  to: ['+12025550177'], message: { parts: [{ type: 'text', value: 'Should not duplicate.' }], idempotency_key: 'fives:daily:1' },
});
assert.equal(replay.payload.message.id, automatic.payload.message.id);

const attachment = await harness.call('POST', '/v3/attachments', {
  filename: 'fixture.pdf', content_type: 'application/pdf', size_bytes: 1024,
}, { 'content-type': 'application/json', authorization: 'Bearer linq_emulator_token' });
assert.equal(attachment.status, 200);
assert.equal(attachment.payload.http_method, 'PUT');
assert.equal(attachment.payload.required_headers['Content-Length'], '1024');
const attachmentMetadata = await harness.call('GET', `/v3/attachments/${attachment.payload.attachment_id}`);
assert.equal(attachmentMetadata.payload.filename, 'fixture.pdf');

const messages = await harness.call('GET', `/v3/chats/${created.payload.chat.id}/messages`);
assert.equal(messages.payload.messages.length, 2);

const subscription = await harness.call('POST', '/v3/webhook_subscriptions', {
  target_url: 'https://example.com/linq-webhook',
  subscribed_events: ['message.sent', 'message.delivered'],
}, { 'content-type': 'application/json' });
assert.match(subscription.payload.signing_secret, /^whsec_linq_emulator_/);

const updatedSubscription = await harness.call('PUT', `/v3/webhook_subscriptions/${subscription.payload.id}`, {
  is_active: false,
  subscribed_events: ['message.failed'],
}, { 'content-type': 'application/json', authorization: 'Bearer linq_emulator_token' });
assert.equal(updatedSubscription.payload.is_active, false);
assert.deepEqual(updatedSubscription.payload.subscribed_events, ['message.failed']);
assert.equal(updatedSubscription.payload.signing_secret, undefined);

const missing = await harness.call('GET', '/v3/messages/does-not-exist');
assert.equal(missing.status, 404);
assert.equal(missing.payload.error.code, 2001);

console.log('linq smoke ok');
