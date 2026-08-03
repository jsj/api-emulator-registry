# @api-emulator/robinhood-trading

Robinhood Agentic Trading MCP provides account, portfolio, position, market data, watchlist, scanner, and order APIs. It supports equities and options.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/robinhood-trading
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@robinhood-trading/api-emulator.mjs --service robinhood-trading
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /oauth/authorize`
- `POST /oauth/token`
- `POST /mcp/trading`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
robinhood-trading:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://robinhood.com/us/en/support/articles/trading-with-your-agent/)
- [api-emulator](https://github.com/jsj/api-emulator)
