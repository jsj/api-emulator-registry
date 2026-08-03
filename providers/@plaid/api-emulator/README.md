# @api-emulator/plaid

Plaid provides financial APIs for Link, accounts, balances, identity, transactions, institutions, auth, and transfer workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/plaid
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@plaid/api-emulator/src/index.ts --service plaid
```

## Fidelity

- Tier: `contract-backed`
- Evidence: 66% medium conformance score
- Smoke: `node @plaid/smoke.mjs`
- Contract checks: `node scripts/check-plaid-openapi-coverage.mjs`

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
plaid:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://plaid.com/docs/api)
- [api-emulator](https://github.com/jsj/api-emulator)
