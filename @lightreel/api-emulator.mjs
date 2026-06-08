import { createToken, fixedNow, getState, readBody, setState } from '../scripts/provider-plugin-kit.mjs';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const STATE_KEY = 'lightreel:state';
const PROVIDER_DIR = dirname(fileURLToPath(import.meta.url));
const todoFixture = JSON.parse(readFileSync(join(PROVIDER_DIR, 'fixtures', 'captured-todo-app.sanitized.json'), 'utf8'));

function makeConversation(input = {}, index = 1) {
  const id = input.conversationId ?? input.conversation_id ?? createToken('conv', index);
  return {
    conversationId: id,
    title: input.title ?? 'Lightreel Emulator Chat',
    status: input.status ?? 'completed',
    createdAt: input.createdAt ?? fixedNow,
    updatedAt: input.updatedAt ?? fixedNow,
    messages: input.messages ?? [],
  };
}

function initialState(config = {}) {
  const conversations = (config.conversations ?? capturedTodoConversations()).map((conversation, index) => makeConversation(conversation, index + 1));
  return {
    conversations,
    nextConversation: conversations.length + 1,
    ...config,
  };
}

const state = (store) => getState(store, STATE_KEY, () => initialState());
const save = (store, next) => setState(store, STATE_KEY, next);

function lightreelError(c, message, status = 400, type = 'invalid_request_error') {
  return c.json({ error: { message, type } }, status);
}

function hasBearerToken(c) {
  const authorization = c.req.header?.('authorization') ?? c.req.header?.('Authorization') ?? '';
  return /^Bearer\s+\S+$/i.test(authorization);
}

function requireAuth(c) {
  if (hasBearerToken(c)) return undefined;
  return lightreelError(c, 'Missing Authorization bearer token.', 401, 'authentication_error');
}

function validateResponseFields(responseFields) {
  if (responseFields === undefined) return undefined;
  if (!responseFields || typeof responseFields !== 'object' || Array.isArray(responseFields)) {
    return 'response_fields must be an object.';
  }
  const entries = Object.entries(responseFields);
  if (entries.length > 5) return 'response_fields supports up to 5 fields.';
  for (const [name, field] of entries) {
    if (!name) return 'response_fields keys must be non-empty.';
    if (!field || typeof field !== 'object' || !['string', 'array'].includes(field.type)) {
      return `response_fields.${name}.type must be "string" or "array".`;
    }
  }
  return undefined;
}

function answerFor(question) {
  if (question === todoFixture.requests.plainChat.body.question) {
    return todoFixture.responses.plainChat.json.answer;
  }
  return `Lightreel emulator answer for: ${question}`;
}

function structuredAnswer(question, responseFields) {
  const captured = todoFixture.responses.structuredChat.json.answer;
  if (question === todoFixture.requests.structuredChat.body.question) {
    return Object.fromEntries(
      Object.entries(responseFields).map(([name, field]) => [
        name,
        captured[name] ?? (field.type === 'array' ? [] : ''),
      ]),
    );
  }
  return Object.fromEntries(
    Object.entries(responseFields).map(([name, field]) => [
      name,
      field.type === 'array'
        ? [`${name} idea 1 for ${question}`, `${name} idea 2 for ${question}`]
        : `${name} summary for ${question}`,
    ]),
  );
}

function summary(conversation) {
  return {
    conversationId: conversation.conversationId,
    title: conversation.title,
    status: conversation.status,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
}

function findConversation(current, id) {
  return current.conversations.find((conversation) => conversation.conversationId === id);
}

function capturedTodoConversations() {
  const plain = todoFixture.responses.plainChat.json;
  const structured = todoFixture.responses.structuredChat.json;
  const plainTranscript = todoFixture.responses.transcript.json;
  const summaries = todoFixture.responses.chats.json.conversations;
  const plainSummary = summaries.find((conversation) => conversation.conversationId === plain.conversationId) ?? {};
  const structuredSummary = summaries.find((conversation) => conversation.conversationId === structured.conversationId) ?? {};
  return [
    {
      ...structuredSummary,
      conversationId: structured.conversationId,
      title: structuredSummary.title ?? todoFixture.requests.structuredChat.body.question,
      status: structuredSummary.status ?? 'completed',
      messages: [
        { role: 'user', question: todoFixture.requests.structuredChat.body.question },
        { role: 'assistant', answer: structured.answer },
      ],
    },
    {
      ...plainSummary,
      conversationId: plain.conversationId,
      title: plainSummary.title ?? todoFixture.requests.plainChat.body.question,
      status: plainSummary.status ?? 'completed',
      createdAt: plainTranscript.createdAt,
      updatedAt: plainTranscript.updatedAt,
      messages: plainTranscript.messages,
    },
  ];
}

export function seedFromConfig(store, _baseUrl, config = {}) {
  return save(store, initialState(config));
}

export const contract = {
  provider: 'lightreel',
  source: 'User-provided Lightreel HTTP API reference and lightreel npm SDK 0.1.0',
  docs: 'https://api.lightreel.ai',
  baseUrl: 'https://api.lightreel.ai',
  auth: 'Authorization: Bearer <api_key>',
  scope: ['chat.create', 'chat.structured_output', 'chat.get', 'chats.list'],
  fidelity: 'stateful-rest-emulator',
};

export const plugin = {
  name: 'lightreel',
  register(app, store) {
    app.post('/v1/chat', async (c) => {
      const authError = requireAuth(c);
      if (authError) return authError;

      const body = await readBody(c);
      if (!body.question || typeof body.question !== 'string') {
        return lightreelError(c, '"question" is required.', 400, 'invalid_request_error');
      }
      const responseFieldsError = validateResponseFields(body.response_fields);
      if (responseFieldsError) return lightreelError(c, responseFieldsError, 400, 'invalid_request_error');

      const current = state(store);
      let conversation = body.conversation_id ? findConversation(current, body.conversation_id) : undefined;
      if (body.conversation_id && !conversation) {
        return lightreelError(c, 'Conversation not found.', 404, 'invalid_request_error');
      }
      if (!conversation) {
        conversation = makeConversation({
          conversationId: createToken('conv', current.nextConversation),
          title: body.question.slice(0, 80),
        }, current.nextConversation);
        current.nextConversation += 1;
        current.conversations.unshift(conversation);
      }

      const answer = body.response_fields ? structuredAnswer(body.question, body.response_fields) : answerFor(body.question);
      conversation.messages.push({ role: 'user', question: body.question });
      conversation.messages.push({ role: 'assistant', answer });
      conversation.updatedAt = fixedNow;
      save(store, current);
      return c.json({ conversationId: conversation.conversationId, answer });
    });

    app.get('/v1/chat/:id', (c) => {
      const authError = requireAuth(c);
      if (authError) return authError;
      const conversation = findConversation(state(store), c.req.param('id'));
      if (!conversation) return lightreelError(c, 'Conversation not found.', 404, 'invalid_request_error');
      return c.json({
        conversationId: conversation.conversationId,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        messages: conversation.messages,
      });
    });

    app.get('/v1/chats', (c) => {
      const authError = requireAuth(c);
      if (authError) return authError;
      return c.json({ conversations: state(store).conversations.slice(0, 50).map(summary) });
    });

    app.get('/lightreel/inspect/contract', (c) => c.json(contract));
    app.get('/lightreel/inspect/state', (c) => c.json(state(store)));
    app.get('/lightreel/fixtures/todo-app', (c) => c.json(todoFixture));
  },
};

export const label = 'Lightreel API emulator';
export const endpoints = contract.scope.join(', ');
export const capabilities = contract.scope;
export const initConfig = { lightreel: initialState() };
export default plugin;
