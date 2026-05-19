# @api-emulator/signal-messaging

Signal Messaging emulator for the signal-cli-rest-api-style HTTP routes used by local Signal automation clients.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/signal-messaging
```

## Run

```bash
npx -p api-emulator api --plugin ./@signal-messaging/api-emulator.mjs --service signal-messaging
```

## Endpoints

- `GET /v1/about` — returns emulator and capability metadata
- `POST /v1/register/:number` — starts deterministic registration
- `POST /v1/register/:number/verify/:code` — marks a fake account as registered
- `POST /v2/send` — records a Signal message send
- `GET /v1/receive/:number` — returns deterministic receive envelopes
- `GET /v1/groups/:number` — lists seeded groups for an account

## Auth

No real Signal credentials are required. Emulator-only account IDs such as `signal-account-a` are accepted, and all message state stays in the in-memory emulator store.

## Seed Configuration

```yaml
signal-messaging:
  accounts:
    - number: signal-account-a
      registered: true
  groups:
    - id: group.emulator
      name: Emulator Group
      members: ["signal-account-a"]
```

## Links

- [signal-cli-rest-api docs](https://bbernhard.github.io/signal-cli-rest-api/)
- [Signal specifications](https://signal.org/docs/)
- [api-emulator](https://github.com/jsj/api-emulator)
