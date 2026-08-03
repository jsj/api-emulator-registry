# @api-emulator/imsg

imsg provides a stateful iMessage fakout API plus deterministic macOS Messages chat.db fixtures for testing chats, history, search, send, RPC, tapbacks, and attachments.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/imsg
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@imsg/api-emulator.mjs --service imsg
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /imsg/inspect/contract`
- `GET /imsg/inspect/state`
- `GET /imsg/fixtures/chat-db.sql`
- `GET /imsg/status`
- `GET /imsg/account`
- `GET /imsg/chats`
- `GET /imsg/chats/:chatId/history`
- `GET /imsg/search`
- `POST /imsg/send`
- `POST /imsg/react`
- `POST /imsg/rpc`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
imsg:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/zmirror/imsg)
- [api-emulator](https://github.com/jsj/api-emulator)
