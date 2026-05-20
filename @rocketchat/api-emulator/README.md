# @api-emulator/rocketchat

Rocket.Chat provides team chat APIs for rooms, direct messages, group and channel history, room metadata, and message posting.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/rocketchat
```

## Run

```bash
npx -p api-emulator api --plugin ./@rocketchat/api-emulator/src/index.js --service rocketchat
```

## Endpoints

- `GET /api/v1/rooms.get`
- `GET /api/v1/im.list`
- `GET /api/v1/groups.info`
- `GET /api/v1/channels.info`
- `GET /api/v1/im.info`
- `GET /api/v1/groups.history`
- `GET /api/v1/channels.history`
- `GET /api/v1/im.history`
- `POST /api/v1/chat.postMessage`

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
rocketchat:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
