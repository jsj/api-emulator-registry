# @api-emulator/financialdatasets

Financial Datasets provides stock prices, company facts, financial statements, SEC filings, news, and macro interest-rate APIs.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/financialdatasets
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@financialdatasets/api-emulator.mjs --service financialdatasets
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
financialdatasets:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.financialdatasets.ai/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
