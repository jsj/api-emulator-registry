# @api-emulator/anotes

anotes provides a stateful Apple Notes fakout API plus deterministic NoteStore.sqlite fixtures for testing note bodies, folders, search, JSON-RPC, and local CLI reads.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/anotes
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@anotes/api-emulator.mjs --service anotes
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
anotes:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/zmirror/anotes-cli)
- [api-emulator](https://github.com/jsj/api-emulator)
