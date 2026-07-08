# @api-emulator/metlife

MetLife APIs provide needs analysis, product recommendation, quote illustration, and life application submission workflows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/metlife
```

## Run

```bash
npx -p api-emulator api --plugin ./@metlife/api-emulator.mjs --service metlife
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET /v1/products`
- `POST /v1/needs-analysis`
- `POST /v1/quote-illustrations`
- `GET /v1/quote-illustrations/:quoteId`
- `POST /v1/applications`
- `GET /v1/applications/:applicationId`
- `GET /inspect/contract`
- `GET /inspect/state`

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
metlife:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://emea.developer.metlife.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
