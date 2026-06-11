# @api-emulator/alpha-vantage

Deterministic Alpha Vantage-compatible market data responses for local tests and no-network sandboxes.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/alpha-vantage
```

## Run

```bash
npx -p api-emulator api --plugin ./@alpha-vantage/api-emulator.mjs --service alpha-vantage
```

## Endpoints

- `GET /query?function=GLOBAL_QUOTE&symbol=IBM` — returns an Alpha Vantage `Global Quote` envelope
- `GET /query?function=TIME_SERIES_DAILY&symbol=IBM` — returns compact daily OHLCV time series data
- `GET /query?function=SYMBOL_SEARCH&keywords=tesco` — returns `bestMatches` search results
- `GET /query?function=MARKET_STATUS` — returns global market open/close status rows

## Auth

Alpha Vantage uses an `apikey` query parameter. The emulator accepts `alpha-vantage-emulator-key` and `demo`; missing or unknown keys return the documented `Error Message` envelope. Do not use real Alpha Vantage API keys in committed fixtures or smoke tests.

## Seed Configuration

```yaml
alpha-vantage:
  acceptedApiKeys:
    - alpha-vantage-emulator-key
  quotes:
    IBM:
      "01. symbol": IBM
      "05. price": "272.3600"
  daily:
    IBM:
      "Meta Data":
        "2. Symbol": IBM
      "Time Series (Daily)":
        "2026-06-10":
          "4. close": "272.3600"
```

## CLI Smoke

No official Alpha Vantage CLI with a documented local base URL override is used for automated verification. Coverage is direct route smoke only.

## Links

- [Official API docs](https://www.alphavantage.co/documentation/)
- [api-emulator](https://github.com/jsj/api-emulator)
