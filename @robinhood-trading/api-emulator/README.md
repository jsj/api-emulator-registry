# @api-emulator/robinhood-trading

Robinhood Agentic Trading MCP provides the verified 46-tool surface: accounts and portfolios, realized P&L and trade history, equity and option positions and tax lots, equity historical bars and technical indicators, earnings, quotes with Greeks, option chains, saved scanners, watchlists, order review, placement, cancellation, and symbol search.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/robinhood-trading
```

## Run

```bash
npx -p api-emulator api --plugin ./@robinhood-trading/api-emulator.mjs --service robinhood-trading
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET /oauth/authorize`
- `POST /oauth/token`
- `POST /mcp/trading`
- `GET /inspect/contract`
- `GET /inspect/state`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
robinhood-trading:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://robinhood.com/us/en/support/articles/trading-with-your-agent/)
- [api-emulator](https://github.com/jsj/api-emulator)
