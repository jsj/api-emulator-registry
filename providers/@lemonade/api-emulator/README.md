# @api-emulator/lemonade

Lemonade-style insurance APIs provide customer, renters quote, policy binding, and claim workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/lemonade
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@lemonade/api-emulator.mjs --service lemonade
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/customers`
- `POST /v1/customers`
- `GET /v1/quotes`
- `POST /v1/quotes/renters`
- `POST /v1/policies`
- `GET /v1/policies/:policyId`
- `GET /v1/claims`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
lemonade:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.lemonade.com/api)
- [api-emulator](https://github.com/jsj/api-emulator)
