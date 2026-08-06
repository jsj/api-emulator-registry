# @api-emulator/yahoo-finance

Yahoo Finance query APIs provide chart, quote, quote summary, and fundamentals time-series data used by yfinance.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/yahoo-finance
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@yahoo-finance/api-emulator.mjs --service yahoo-finance
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /`
- `GET /consent`
- `POST /v2/collectConsent`
- `GET /copyConsent`
- `GET /v1/test/getcrumb`
- `GET /v8/finance/chart/:symbol`
- `GET /v10/finance/quoteSummary/:symbol`
- `GET /v7/finance/quote`
- `GET /ws/fundamentals-timeseries/v1/finance/timeseries/:symbol`
- `GET /v7/finance/options/:symbol`
- `GET /v1/finance/search`
- `GET /v1/finance/lookup`
- `GET /v1/finance/screener/predefined/saved`
- `POST /v1/finance/screener`
- `GET /v1/finance/sectors/:key`
- `GET /v1/finance/industries/:key`
- `GET /v6/finance/quote/marketSummary`
- `GET /v6/finance/markettime`
- `POST /v1/finance/visualization`
- `POST /xhr/ncp`
- `GET /calendar/earnings`
- `GET /quote/:symbol/key-statistics`
- `GET /ajax/SearchController_Suggest`
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
yahoo-finance:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/ranaroussi/yfinance)
- [api-emulator](https://github.com/jsj/api-emulator)
