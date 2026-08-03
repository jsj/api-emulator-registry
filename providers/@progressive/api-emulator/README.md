# @api-emulator/progressive

Progressive-style insurance APIs provide auto quotes, policy servicing, customer, and claim workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/progressive
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@progressive/api-emulator.mjs --service progressive
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/customers`
- `GET /v1/policies`
- `GET /v1/policies/:policyId`
- `GET /v1/quotes`
- `POST /v1/quotes/auto`
- `GET /v1/claims`
- `POST /v1/claims`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
progressive:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.progressive.com/s/)
- [api-emulator](https://github.com/jsj/api-emulator)
