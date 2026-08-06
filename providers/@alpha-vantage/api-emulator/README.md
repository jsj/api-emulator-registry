# @api-emulator/alpha-vantage

Alpha Vantage provides stock quote, time series, symbol search, and market status data through a query-parameter API.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/alpha-vantage
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@alpha-vantage/api-emulator.mjs --service alpha-vantage
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /query`
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
alpha-vantage:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.alphavantage.co/documentation/)
- [api-emulator](https://github.com/jsj/api-emulator)
