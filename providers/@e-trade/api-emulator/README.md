# @api-emulator/e-trade

E*TRADE provides brokerage APIs for OAuth 1.0a authorization, accounts, balances, portfolios, market quotes, orders, and order previews.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/e-trade
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@e-trade/api-emulator.mjs --service e-trade
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/accounts/list${suffix}`
- `GET /v1/accounts/:accountIdKey/balance${suffix}`
- `GET /v1/accounts/:accountIdKey/portfolio${suffix}`
- `GET /v1/accounts/:accountIdKey/orders${suffix}`
- `POST /v1/accounts/:accountIdKey/orders/preview${suffix}`
- `GET /oauth/request_token`
- `GET /oauth/access_token`
- `GET /oauth/renew_access_token`
- `GET /oauth/revoke_access_token`
- `GET /v1/market/quote/:symbols`
- `GET /v1/market/quote/:symbols.json`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
e-trade:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://apisb.etrade.com/docs/api/account/api-account-v1.html)
- [api-emulator](https://github.com/jsj/api-emulator)
