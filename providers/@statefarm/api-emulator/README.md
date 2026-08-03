# @api-emulator/statefarm

State Farm-style insurance APIs provide renters quote, policy, claim, billing, and customer workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/statefarm
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@statefarm/api-emulator.mjs --service statefarm
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/customers`
- `GET /v1/quotes`
- `POST /v1/quotes/renters`
- `GET /v1/policies`
- `GET /v1/policies/:policyId`
- `POST /v1/claims`
- `GET /v1/billing/bills`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
statefarm:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.statefarm/api/renters)
- [api-emulator](https://github.com/jsj/api-emulator)
