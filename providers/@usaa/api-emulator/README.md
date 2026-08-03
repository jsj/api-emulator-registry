# @api-emulator/usaa

USAA-style Open Finance APIs provide FDX account, customer, balance, and transaction data workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/usaa
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@usaa/api-emulator.mjs --service usaa
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /fdx/v6/customers/current`
- `GET /fdx/v6/accounts`
- `GET /fdx/v6/accounts/:accountId`
- `GET /fdx/v6/accounts/:accountId/transactions`
- `GET /customers/current`
- `GET /accounts`
- `GET /accounts/:accountId`
- `GET /accounts/:accountId/transactions`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
usaa:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.akoya.com/reference/fdx-apis)
- [api-emulator](https://github.com/jsj/api-emulator)
