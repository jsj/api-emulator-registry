# @api-emulator/anotes

anotes provides a stateful Apple Notes fakout API plus deterministic NoteStore.sqlite fixtures for testing note bodies, folders, search, JSON-RPC, and local CLI reads.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/anotes
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@anotes/api-emulator.mjs --service anotes
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /anotes/inspect/contract`
- `GET /anotes/inspect/state`
- `GET /anotes/fixtures/note-store.sql`
- `GET /anotes/status`
- `GET /anotes/folders`
- `GET /anotes/notes`
- `GET /anotes/notes/:noteId`
- `GET /anotes/search`
- `POST /anotes/notes`
- `POST /anotes/rpc`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
anotes:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/zmirror/anotes-cli)
- [api-emulator](https://github.com/jsj/api-emulator)
