# @api-emulator/geico

GEICO-style P&C insurance APIs provide customer, auto policy, claim, billing, and quote workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/geico
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@geico/api-emulator.mjs --service geico
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/customers/current`
- `GET /v1/policies`
- `GET /v1/policies/:policyId`
- `GET /v1/policies/:policyId/claims`
- `GET /v1/claims/:claimId`
- `POST /v1/claims`
- `GET /v1/billing/invoices`
- `POST /v1/quotes/auto`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
geico:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.geico.com/about/b2b-services/)
- [api-emulator](https://github.com/jsj/api-emulator)
