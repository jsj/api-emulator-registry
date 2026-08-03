# @api-emulator/rocketchat

Rocket.Chat provides team chat APIs for rooms, direct messages, group and channel history, room metadata, and message posting.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/rocketchat
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@rocketchat/api-emulator/src/index.js --service rocketchat
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

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

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
rocketchat:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
