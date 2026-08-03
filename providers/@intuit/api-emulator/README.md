# @api-emulator/intuit

Intuit QuickBooks Online provides accounting APIs for OAuth, company info, query, customers, invoices, payments, and accounts.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/intuit
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@intuit/api-emulator.mjs --service intuit
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /oauth2/v1/tokens/bearer`
- `GET /v3/company/:realmId/companyinfo/:companyId`
- `GET /v3/company/:realmId/query`
- `POST /v3/company/:realmId/query`
- `POST /v3/company/:realmId/customer`
- `GET /v3/company/:realmId/customer/:id`
- `POST /v3/company/:realmId/invoice`
- `GET /v3/company/:realmId/invoice/:id`
- `POST /v3/company/:realmId/payment`
- `GET /v3/company/:realmId/account/:id`
- `GET /intuit/inspect/state`
- `GET /inspect/contract`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
intuit:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account)
- [api-emulator](https://github.com/jsj/api-emulator)
