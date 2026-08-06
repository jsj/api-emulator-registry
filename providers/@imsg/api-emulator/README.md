# @api-emulator/imsg

imsg provides a stateful iMessage fakout API plus deterministic macOS Messages chat.db fixtures for testing chats, history, search, send, RPC, tapbacks, and attachments.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/imsg
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@imsg/api-emulator.mjs --service imsg
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
imsg:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/zmirror/imsg)
- [api-emulator](https://github.com/jsj/api-emulator)
