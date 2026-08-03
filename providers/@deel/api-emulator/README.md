# @api-emulator/deel

Deel provides workforce APIs for people, legal entities, contracts, invoices, roles, and organization structures.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/deel
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@deel/api-emulator.mjs --service deel
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /rest/v2/contracts`
- `GET /rest/v2/invoices/:id/download`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
deel:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.deel.com/api/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
