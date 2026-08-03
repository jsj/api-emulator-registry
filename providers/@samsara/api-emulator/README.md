# @api-emulator/samsara

Samsara provides connected operations APIs for fleets, vehicles, drivers, routes, sensors, safety, and telematics.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/samsara
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@samsara/api-emulator.mjs --service samsara
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /fleet/routes`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
samsara:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.samsara.com/reference/overview)
- [api-emulator](https://github.com/jsj/api-emulator)
