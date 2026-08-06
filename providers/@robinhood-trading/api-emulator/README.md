# @api-emulator/robinhood-trading

Robinhood Agentic Trading MCP provides account, portfolio, position, market data, watchlist, scanner, and order APIs. It supports equities and options.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/robinhood-trading
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@robinhood-trading/api-emulator.mjs --service robinhood-trading
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /oauth/authorize`
- `POST /oauth/token`
- `POST /mcp/trading`
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
robinhood-trading:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://robinhood.com/us/en/support/articles/trading-with-your-agent/)
- [api-emulator](https://github.com/jsj/api-emulator)
