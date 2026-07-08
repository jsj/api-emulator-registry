# @api-emulator/financialdatasets

Financial Datasets provides stock prices, company facts, financial statements, SEC filings, news, and macro interest-rate APIs.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/financialdatasets
```

## Run

```bash
npx -p api-emulator api --plugin ./@financialdatasets/api-emulator.mjs --service financialdatasets
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET /prices/tickers`
- `GET /prices/snapshot/tickers`
- `GET /company/facts/tickers`
- `GET /company/facts/ciks`
- `GET /prices`
- `GET /prices/snapshot`
- `GET /prices/snapshot/market`
- `GET /company/facts`
- `GET /financials/income-statements`
- `GET /financials/balance-sheets`
- `GET /financials/cash-flow-statements`
- `GET /financials`
- `GET /filings`
- `GET /filings/tickers`
- `GET /filings/ciks`
- `GET /filings/types`
- `GET /news`
- `GET /macro/interest-rates/banks`
- `GET /macro/interest-rates`
- `GET /macro/interest-rates/snapshot`
- `GET /inspect/contract`
- `GET /inspect/state`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
financialdatasets:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.financialdatasets.ai/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
