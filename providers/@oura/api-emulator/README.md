# @api-emulator/oura

Oura Ring provides health APIs for personal info, daily sleep, readiness, activity, workouts, and heart-rate data.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/oura
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@oura/api-emulator.mjs --service oura
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v2/usercollection/personal_info`
- `GET /v2/usercollection/daily_sleep`
- `GET /v2/usercollection/sleep`
- `GET /v2/usercollection/daily_readiness`
- `GET /v2/usercollection/daily_activity`
- `GET /v2/usercollection/workout`
- `GET /v2/usercollection/heartrate`
- `GET /v2/sandbox/usercollection/daily_sleep`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
oura:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://cloud.ouraring.com/v2/docs)
- [api-emulator](https://github.com/jsj/api-emulator)
