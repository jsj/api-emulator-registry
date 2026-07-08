# @api-emulator/snappr

Snappr provides visual-content APIs for coverage, availability, photoshoot bookings, editing jobs, presets, and asset retrieval.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/snappr
```

## Run

```bash
npx -p api-emulator api --plugin ./@snappr/api-emulator.mjs --service snappr
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET /coverage`
- `GET /availability`
- `POST /bookings`
- `GET /bookings`
- `GET /bookings/:bookingUid`
- `GET /bookings/:bookingUid/images`
- `GET /bookings/:bookingUid/videos`
- `POST /editing-jobs`
- `GET /editing-jobs`
- `GET /editing-jobs/:editingJobUid`
- `GET /editing-jobs/:editingJobUid/images`
- `GET /presets`
- `GET /shoottypes`
- `GET /editing-job-types`
- `GET /inspect/contract`
- `GET /inspect/state`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
snappr:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.snappr.com/#introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
