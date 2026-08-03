# @api-emulator/eight-sleep

Eight Sleep provides health and smart-bed APIs for user profiles, devices, sleep trends, biometric intervals, and temperature control.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/eight-sleep
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@eight-sleep/api-emulator.mjs --service eight-sleep
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

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

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
eight-sleep:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/steipete/eightctl)
- [api-emulator](https://github.com/jsj/api-emulator)
