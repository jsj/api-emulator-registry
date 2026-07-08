# @api-emulator/signal-messaging

Signal Messaging provides signal-cli-rest-api-compatible local messaging routes for registration, sending, receiving, and groups.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/signal-messaging
```

## Run

```bash
npx -p api-emulator api --plugin ./@signal-messaging/api-emulator.mjs --service signal-messaging
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET /v1/about`
- `POST /v1/register/:number`
- `POST /v1/register/:number/verify/:code`
- `POST /v2/send`
- `GET /v1/receive/:number`
- `GET /v1/groups/:number`
- `GET /inspect/contract`
- `GET /inspect/state`

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
signal-messaging:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://bbernhard.github.io/signal-cli-rest-api/)
- [api-emulator](https://github.com/jsj/api-emulator)
