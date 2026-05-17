# @api-emulator/yahoo-finance

Yahoo Finance query APIs provide chart, quote, quote summary, and fundamentals time-series data used by yfinance.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/yahoo-finance
```

## Run

```bash
npx -p api-emulator api --plugin ./@yahoo-finance/api-emulator.mjs --service yahoo-finance
```

## Endpoints

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

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
yahoo-finance:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/ranaroussi/yfinance)
- [api-emulator](https://github.com/jsj/api-emulator)
