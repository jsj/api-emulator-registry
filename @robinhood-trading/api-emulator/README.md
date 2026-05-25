# @api-emulator/robinhood-trading

Robinhood Agentic Trading MCP provides a documentation-informed subset for accounts, portfolios, positions, quotes, order review, placement, cancellation, and symbol search while fuller access is pending from Robinhood.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/robinhood-trading
```

## Run

```bash
npx -p api-emulator api --plugin ./@robinhood-trading/api-emulator.mjs --service robinhood-trading
```

## Endpoints

- `POST /mcp/trading`
- `GET /inspect/contract`
- `GET /inspect/state`

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
robinhood-trading:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://robinhood.com/us/en/support/articles/trading-with-your-agent/)
- [api-emulator](https://github.com/jsj/api-emulator)
