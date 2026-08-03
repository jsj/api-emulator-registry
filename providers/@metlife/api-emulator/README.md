# @api-emulator/metlife

MetLife APIs provide needs analysis, product recommendation, quote illustration, and life application submission workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/metlife
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@metlife/api-emulator.mjs --service metlife
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/products`
- `POST /v1/needs-analysis`
- `POST /v1/quote-illustrations`
- `GET /v1/quote-illustrations/:quoteId`
- `POST /v1/applications`
- `GET /v1/applications/:applicationId`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
metlife:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://emea.developer.metlife.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
