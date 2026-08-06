# @api-emulator/interactive-brokers

Interactive Brokers Client Portal Web API provides session, accounts, portfolio, market data, contract search, and order workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/interactive-brokers
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@interactive-brokers/api-emulator.mjs --service interactive-brokers
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /oauth2/api/v1/token`
- `GET /iserver/auth/status`
- `POST /iserver/reauthenticate`
- `GET /iserver/accounts`
- `GET /portfolio/accounts`
- `GET /portfolio/subaccounts`
- `GET /portfolio/:accountId/positions/:pageId`
- `GET /portfolio/:accountId/ledger`
- `GET /portfolio/:accountId/summary`
- `GET /iserver/secdef/search`
- `GET /iserver/marketdata/snapshot`
- `GET /iserver/account/orders`
- `POST /iserver/account/:accountId/orders`
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
interactive-brokers:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.interactivebrokers.com/campus/ibkr-api-page/cpapi-v1/)
- [api-emulator](https://github.com/jsj/api-emulator)
