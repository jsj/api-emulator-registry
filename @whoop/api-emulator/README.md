# @api-emulator/whoop

WHOOP provides health APIs for athlete profiles, body measurements, cycles, recovery, sleep, and workouts.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/whoop
```

## Run

```bash
npx -p api-emulator api --plugin ./@whoop/api-emulator.mjs --service whoop
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

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

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
whoop:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.whoop.com/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
