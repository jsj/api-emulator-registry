# @api-emulator/adp

ADP provides Human Capital Management APIs for workers, payroll events, organizations, time, and pay data.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/adp
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@adp/api-emulator.mjs --service adp
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /hr/v2/workers`
- `GET /hr/v2/workers/:associateOid`
- `POST /events/hr/v1/worker.hire`
- `POST /payroll/v1/pay-data-input`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
adp:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.adp.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
