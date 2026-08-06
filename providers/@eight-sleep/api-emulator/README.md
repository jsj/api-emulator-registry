# @api-emulator/eight-sleep

Eight Sleep provides health and smart-bed APIs for user profiles, devices, sleep trends, biometric intervals, and temperature control.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/eight-sleep
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@eight-sleep/api-emulator.mjs --service eight-sleep
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /v1/tokens`
- `POST /v1/login`
- `GET /v1/users/me`
- `GET /v1/devices/:deviceId`
- `GET /v1/users/:userId/trends`
- `GET /v1/users/:userId/intervals/:sessionId`
- `GET /v1/users/:userId/temperature`
- `PUT /v1/users/:userId/temperature`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
eight-sleep:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/steipete/eightctl)
- [api-emulator](https://github.com/jsj/api-emulator)
