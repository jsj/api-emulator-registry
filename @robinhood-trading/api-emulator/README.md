# @api-emulator/robinhood-trading

Robinhood Agentic Trading MCP provides an emulator for accounts, portfolios, equity and option positions, quotes with Greeks, option chains, option instruments, watchlists, order review, placement, cancellation, and symbol search.

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

## Tool Coverage

The emulator advertises the 34 MCP tools returned by Robinhood Trading MCP, including equity tools, index quotes, option chain/instrument/quote/position/order tools, watchlist read/mutation tools, and symbol search.

The Streamable HTTP MCP handshake returns protocol version `2025-06-18`. The live watchlist schema was checked on `2026-06-17`: `create_watchlist` creates metadata-only custom lists, `add_to_watchlist` adds stocks/ETFs, crypto currency-pair IDs, or market-index IDs, and options use `add_option_to_watchlist`.

Supported emulator order types are `market`, `limit`, and `stop_limit` for equity orders, and `limit` for option orders. Unsupported order types return a 400 MCP error.

The option activity read surface was checked against the live read-only tool schema on `2026-06-12`:

- `get_option_orders(account_number, order_id?, state?, created_at_gte?, chain_ids?, underlying_type?, placed_agent?, cursor?)`
- `get_option_positions(account_number, nonzero?, chain_ids?, option_ids?, type?, option_type?, expiration_date?, expiration_date_lte?, expiration_date_gte?, cursor?)`

`created_at_lte` is not part of the observed `get_option_orders` schema. Clients should request from a lower bound and apply an upper-bound filter locally when they need a date window.

## Auth

No production credentials are required. Use fake local credentials in client tests.

The proof capture helper can validate the live read-only contract through mcporter without adding real brokerage data to this package:

```bash
SINCE=2021-01-01 UNTIL=2021-12-31 node @robinhood-trading/scripts/capture-options-activity.mjs
```

The script only calls `get_accounts`, `get_option_orders`, and `get_option_positions`. Raw captures are written under `.emu/`, which is gitignored because account/order history is PII.

## Seed Configuration

```yaml
robinhood-trading:
  accounts:
    - account_number: RHAGENTIC001
      agentic_allowed: true
  optionQuotes:
    - instrument_id: AAPL260116C00200000
      delta: "0.54"
      gamma: "0.036"
      theta: "-0.071"
      vega: "0.118"
  optionOrders:
    - id: rh_option_order_seed_1
      account_number: RHAGENTIC001
      option_id: AAPL260116C00200000
      chain_id: 7dd906e5-7d4b-4161-a3fe-2c3b62038482
      direction: debit
      state: filled
      created_at: "2026-01-02T15:00:00.000Z"
      processed_premium: "580"
    - id: rh_option_order_seed_2
      account_number: RHAGENTIC001
      option_id: AAPL260116C00200000
      chain_id: 7dd906e5-7d4b-4161-a3fe-2c3b62038482
      direction: credit
      state: filled
      created_at: "2026-01-05T15:00:00.000Z"
      processed_premium: "622"
  watchlists:
    - id: watchlist-default
      display_name: Agentic Watchlist
      symbols: [AAPL]
      option_ids: [AAPL260116C00200000]
```

## Links

- [Official API docs](https://robinhood.com/us/en/support/articles/trading-with-your-agent/)
- [api-emulator](https://github.com/jsj/api-emulator)
