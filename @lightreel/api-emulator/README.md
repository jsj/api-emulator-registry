# @api-emulator/lightreel

Lightreel provides chat APIs for social media research questions, structured agent answers, and API chat transcripts.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/lightreel
```

## Run

```bash
npx -p api-emulator api --plugin ./@lightreel/api-emulator.mjs --service lightreel
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `POST /v1/chat`
- `GET /v1/chat/:id`
- `GET /v1/chats`
- `GET /lightreel/inspect/contract`
- `GET /lightreel/inspect/state`
- `GET /lightreel/fixtures/todo-app`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
lightreel:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.lightreel.ai)
- [api-emulator](https://github.com/jsj/api-emulator)
