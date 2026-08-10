# @api-emulator/rocketchat

Rocket.Chat provides team chat APIs for rooms, direct messages, group and channel history, room metadata, and message posting.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/rocketchat
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@rocketchat/api-emulator/src/index.js --service rocketchat
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/v1/rooms.get`
- `GET /api/v1/im.list`
- `GET /api/v1/groups.info`
- `GET /api/v1/channels.info`
- `GET /api/v1/im.info`
- `GET /api/v1/groups.history`
- `GET /api/v1/channels.history`
- `GET /api/v1/im.history`
- `POST /api/v1/chat.postMessage`

History endpoints support `count`, `offset`, `latest`, and `inclusive` for
incremental synchronization and backward pagination.

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
rocketchat:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
