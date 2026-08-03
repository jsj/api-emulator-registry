# @api-emulator/shipstation

ShipStation provides shipping APIs for shipments, rates, labels, tracking, and fulfillment workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/shipstation
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@shipstation/api-emulator.mjs --service shipstation
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v2/shipments`
- `POST /v2/shipments`
- `GET /v2/shipments/:id`
- `POST /v2/rates`
- `POST /v2/labels`
- `GET /shipstation/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
shipstation:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.shipstation.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
