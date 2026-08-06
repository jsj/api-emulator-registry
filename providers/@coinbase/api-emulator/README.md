# @api-emulator/coinbase

Coinbase Advanced Trade APIs provide market products, account balances, historical orders, and order preview workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/coinbase
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@coinbase/api-emulator.mjs --service coinbase
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/v3/brokerage/time`
- `GET /api/v3/brokerage/market/products`
- `GET /api/v3/brokerage/market/products/:productId`
- `GET /api/v3/brokerage/accounts`
- `GET /api/v3/brokerage/accounts/:accountUuid`
- `GET /api/v3/brokerage/orders/historical/batch`
- `POST /api/v3/brokerage/orders/preview`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
coinbase:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/rest-api)
- [api-emulator](https://github.com/jsj/api-emulator)
