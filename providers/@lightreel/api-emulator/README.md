# @api-emulator/lightreel

Lightreel provides chat APIs for social media research questions, structured agent answers, and API chat transcripts.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/lightreel
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@lightreel/api-emulator.mjs --service lightreel
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /v1/chat`
- `GET /v1/chat/:id`
- `GET /v1/chats`
- `GET /lightreel/inspect/contract`
- `GET /lightreel/inspect/state`
- `GET /lightreel/fixtures/todo-app`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
lightreel:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.lightreel.ai)
- [api-emulator](https://github.com/jsj/api-emulator)
