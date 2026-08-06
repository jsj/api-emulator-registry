# @api-emulator/intuit

Intuit QuickBooks Online provides accounting APIs for OAuth, company info, query, customers, invoices, payments, and accounts.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/intuit
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@intuit/api-emulator.mjs --service intuit
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
intuit:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account)
- [api-emulator](https://github.com/jsj/api-emulator)
