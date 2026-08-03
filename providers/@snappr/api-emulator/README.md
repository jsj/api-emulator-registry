# @api-emulator/snappr

Snappr provides visual-content APIs for coverage, availability, photoshoot bookings, editing jobs, presets, and asset retrieval.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/snappr
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@snappr/api-emulator.mjs --service snappr
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

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

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
snappr:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.snappr.com/#introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
