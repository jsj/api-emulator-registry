# @api-emulator/financialdatasets

Deterministic emulator for the Financial Datasets API market data, fundamentals, filings, news, and macro rate endpoints.

Part of [api-emulator](https://github.com/jsj/api-emulator) - local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/financialdatasets
```

## Run

```bash
npx -p api-emulator api --plugin ./@financialdatasets/api-emulator.mjs --service financialdatasets
```

## Endpoints

- `GET /prices/tickers` - available price-history tickers.
- `GET /prices` - historical OHLCV rows for a ticker.
- `GET /prices/snapshot` - latest quote snapshot for a ticker.
- `GET /prices/snapshot/market` - latest quote snapshots for all seeded tickers.
- `GET /company/facts` - company metadata by ticker or CIK.
- `GET /financials` - income statement, balance sheet, and cash-flow statement groups.
- `GET /financials/income-statements` - income statement rows.
- `GET /financials/balance-sheets` - balance sheet rows.
- `GET /financials/cash-flow-statements` - cash-flow statement rows.
- `GET /filings` - SEC filing rows.
- `GET /news` - market news rows.
- `GET /macro/interest-rates` - central bank rate history.
- `GET /macro/interest-rates/snapshot` - latest central bank rate.

## Auth

Protected routes require `X-API-KEY`. The default accepted keys are `financialdatasets-emulator-key`, `test-key`, and `demo-key`. Discovery endpoints such as ticker lists are intentionally open to match the OpenAPI contract sections marked without security.

## Seed Configuration

```yaml
financialdatasets:
  acceptedApiKeys:
    - financialdatasets-emulator-key
  companies:
    AAPL:
      ticker: AAPL
      name: Apple Inc.
      cik: "0000320193"
```

## Links

- [Official API docs](https://docs.financialdatasets.ai/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
