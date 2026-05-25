import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
assert.equal(contract.provider, 'agentmail');

const inboxes = await harness.call('GET', '/v0/inboxes');
assert.equal(inboxes.payload.inboxes[0].email, 'emulator@agentmail.to');

const created = await harness.call(
  'POST',
  '/v0/inboxes',
  { username: 'smoke', domain: 'agentmail.to', display_name: 'Smoke Agent' },
  { 'content-type': 'application/json', authorization: 'Bearer agentmail_emulator_key' },
);
assert.equal(created.payload.email, 'smoke@agentmail.to');

const fetched = await harness.call('GET', `/v0/inboxes/${created.payload.inbox_id}`);
assert.equal(fetched.payload.display_name, 'Smoke Agent');

const updated = await harness.call('PATCH', `/v0/inboxes/${created.payload.inbox_id}`, { display_name: 'Updated Smoke Agent' }, { 'content-type': 'application/json' });
assert.equal(updated.payload.display_name, 'Updated Smoke Agent');

const sent = await harness.call(
  'POST',
  `/v0/inboxes/${created.payload.inbox_id}/messages/send`,
  { to: ['recipient@example.com'], subject: 'Smoke hello', text: 'Hello from smoke' },
  { 'content-type': 'application/json' },
);
assert.match(sent.payload.message_id, /^msg_/);

const messages = await harness.call('GET', `/v0/inboxes/${created.payload.inbox_id}/messages?limit=10`);
assert.equal(messages.payload.messages[0].subject, 'Smoke hello');

const message = await harness.call('GET', `/v0/inboxes/${created.payload.inbox_id}/messages/${sent.payload.message_id}`);
assert.equal(message.payload.text, 'Hello from smoke');

const reply = await harness.call(
  'POST',
  `/v0/inboxes/${created.payload.inbox_id}/messages/${sent.payload.message_id}/reply`,
  { text: 'Reply from smoke' },
  { 'content-type': 'application/json' },
);
assert.equal(reply.payload.thread_id, sent.payload.thread_id);

const deleted = await harness.call('DELETE', `/v0/inboxes/${created.payload.inbox_id}`);
assert.equal(deleted.status, 200);

console.log('agentmail smoke ok');
