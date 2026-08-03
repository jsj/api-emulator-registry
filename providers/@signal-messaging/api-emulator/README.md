# @api-emulator/signal-messaging

Signal Messaging provides signal-cli-rest-api-compatible local messaging routes for registration, sending, receiving, and groups.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/signal-messaging
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@signal-messaging/api-emulator.mjs --service signal-messaging
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/about`
- `POST /v1/register/:number`
- `POST /v1/register/:number/verify/:code`
- `POST /v2/send`
- `GET /v1/receive/:number`
- `GET /v1/groups/:number`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
signal-messaging:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://bbernhard.github.io/signal-cli-rest-api/)
- [api-emulator](https://github.com/jsj/api-emulator)
