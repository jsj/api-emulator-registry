# @api-emulator/whoop

WHOOP provides health APIs for athlete profiles, body measurements, cycles, recovery, sleep, and workouts.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/whoop
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@whoop/api-emulator.mjs --service whoop
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /oauth/oauth2/token`
- `GET /developer/v2/user/profile/basic`
- `GET /developer/v2/user/measurement/body`
- `GET /developer/v2/cycle`
- `GET /developer/v2/recovery`
- `GET /developer/v2/activity/sleep`
- `GET /developer/v2/activity/workout`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
whoop:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.whoop.com/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
