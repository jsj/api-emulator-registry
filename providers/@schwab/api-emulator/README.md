# @api-emulator/schwab

Charles Schwab Trader API provides OAuth, brokerage accounts, account hashes, orders, quotes, and option chain data.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/schwab
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@schwab/api-emulator.mjs --service schwab
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /v1/oauth/token`
- `GET /trader/v1/accounts/accountNumbers`
- `GET /trader/v1/accounts`
- `GET /trader/v1/accounts/:accountHash/orders`
- `POST /trader/v1/accounts/:accountHash/orders`
- `GET /trader/v1/accounts/:accountHash/orders/:orderId`
- `GET /marketdata/v1/quotes`
- `GET /marketdata/v1/chains`
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
schwab:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.schwab.com/products/trader-api--individual)
- [api-emulator](https://github.com/jsj/api-emulator)
