# @api-emulator/lightreel

Stateful local emulator for the Lightreel chat HTTP API.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/lightreel
```

## Run

```bash
npx -p api-emulator api --plugin ./@lightreel/api-emulator.mjs --service lightreel
```

## Endpoints

- `POST /v1/chat` — ask a question, continue a conversation, or request structured output with `response_fields`
- `GET /v1/chat/:id` — fetch a full conversation transcript
- `GET /v1/chats` — list the latest 50 API chat summaries
- `GET /lightreel/fixtures/todo-app` — inspect a sanitized live capture for a todo-app launch feedback prompt
- `GET /lightreel/inspect/contract` — inspect emulator contract metadata
- `GET /lightreel/inspect/state` — inspect deterministic emulator state

## Auth

All Lightreel API routes require `Authorization: Bearer <token>`. Any non-empty bearer token is accepted. Missing bearer auth returns `{ "error": { "message": "...", "type": "authentication_error" } }`.

Request validation errors use Lightreel's documented error envelope with type `invalid_request_error`.

## Seed Configuration

```yaml
lightreel:
  conversations:
    - conversationId: conv_seed
      title: Fitness hooks research
      messages:
        - role: user
          question: find me the top fitness hooks this week
        - role: assistant
          answer: Try contrast hooks and visible proof.
```

## Links

- [Lightreel API](https://api.lightreel.ai)
- [lightreel npm package](https://www.npmjs.com/package/lightreel)
- [api-emulator](https://github.com/jsj/api-emulator)
