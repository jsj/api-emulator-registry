# @api-emulator/govinfo

GovInfo provides package collection, summary, and content APIs for official U.S. government publications.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/govinfo
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@govinfo/api-emulator.mjs --service govinfo
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /inspect/contract`
- `GET /collections/:collection/:startDate`
- `GET /packages/:packageId/summary`
- `GET /packages/:packageId/:format`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
govinfo:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.govinfo.gov/docs/)
- [api-emulator](https://github.com/jsj/api-emulator)
