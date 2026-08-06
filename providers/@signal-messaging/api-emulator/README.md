# @api-emulator/signal-messaging

Signal Messaging provides signal-cli-rest-api-compatible local messaging routes for registration, sending, receiving, and groups.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/signal-messaging
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@signal-messaging/api-emulator.mjs --service signal-messaging
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/about`
- `POST /v1/register/:number`
- `POST /v1/register/:number/verify/:code`
- `POST /v2/send`
- `GET /v1/receive/:number`
- `GET /v1/groups/:number`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
signal-messaging:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://bbernhard.github.io/signal-cli-rest-api/)
- [api-emulator](https://github.com/jsj/api-emulator)
