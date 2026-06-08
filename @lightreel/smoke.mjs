import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
const auth = { authorization: 'Bearer lr_live_emulator', 'content-type': 'application/json' };

assert.equal(contract.provider, 'lightreel');

const unauthenticated = await harness.call('GET', '/v1/chats');
assert.equal(unauthenticated.status, 401);
assert.equal(unauthenticated.payload.error.type, 'authentication_error');

const seededChats = await harness.call('GET', '/v1/chats', undefined, auth);
assert.ok(seededChats.payload.conversations.some((conversation) => conversation.conversationId === 'conv_live_todo_plain'));

const fixture = await harness.call('GET', '/lightreel/fixtures/todo-app');
assert.equal(fixture.payload.responses.plainChat.status, 200);
assert.equal(fixture.payload.responses.structuredChat.status, 200);
assert.deepEqual(Object.keys(fixture.payload.responses.structuredChat.json.answer), ['strengths', 'improvements', 'summary']);

const chat = await harness.call('POST', '/v1/chat', { question: 'find me the top fitness hooks this week' }, auth);
assert.match(chat.payload.conversationId, /^conv_/);
assert.equal(typeof chat.payload.answer, 'string');

const continued = await harness.call('POST', '/v1/chat', { question: 'give me 5 more', conversation_id: chat.payload.conversationId }, auth);
assert.equal(continued.payload.conversationId, chat.payload.conversationId);

const structured = await harness.call(
  'POST',
  '/v1/chat',
  {
    question: 'find me the top fitness hooks this week',
    response_fields: {
      hooks: { type: 'array', description: 'the hook lines' },
      summary: { type: 'string', description: 'one-paragraph recap' },
    },
  },
  auth,
);
assert.deepEqual(Object.keys(structured.payload.answer), ['hooks', 'summary']);
assert.ok(Array.isArray(structured.payload.answer.hooks));
assert.equal(typeof structured.payload.answer.summary, 'string');

const transcript = await harness.call('GET', `/v1/chat/${chat.payload.conversationId}`, undefined, auth);
assert.equal(transcript.payload.conversationId, chat.payload.conversationId);
assert.equal(transcript.payload.messages.length, 4);
assert.equal(transcript.payload.messages[0].role, 'user');

const chats = await harness.call('GET', '/v1/chats', undefined, auth);
assert.ok(chats.payload.conversations.some((conversation) => conversation.conversationId === chat.payload.conversationId));
assert.ok(chats.payload.conversations.length <= 50);

const missing = await harness.call('GET', '/v1/chat/conv_missing', undefined, auth);
assert.equal(missing.status, 404);
assert.equal(missing.payload.error.type, 'invalid_request_error');

console.log('lightreel smoke ok');
