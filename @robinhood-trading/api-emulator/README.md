# @api-emulator/robinhood-trading

Robinhood Agentic Trading MCP provides an emulator for accounts, portfolios, equity and option positions, equity historical bars, quotes with Greeks, option chains, option instruments, watchlists, order review, placement, cancellation, and symbol search.

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

The emulator advertises the 34 MCP tools returned by Robinhood Trading MCP, including equity tools, equity historical bars, index quotes, option chain/instrument/quote/position/order tools, watchlist read/mutation tools, and symbol search.

The Streamable HTTP MCP handshake returns protocol version `2025-06-18`. The live watchlist schema was checked on `2026-06-17`: `create_watchlist` creates metadata-only custom lists, `add_to_watchlist` adds stocks/ETFs, crypto currency-pair IDs, or market-index IDs, and options use `add_option_to_watchlist`.

Supported emulator order types are `market`, `limit`, and `stop_limit` for equity orders, and `limit` for option orders. Unsupported order types return a 400 MCP error.

The equity historicals read surface was checked against the live tool on `2026-06-22`:

- `get_equity_historicals(symbols, start_time, end_time?, interval?, bounds?)`

`start_time` must be RFC3339, for example `2026-06-15T00:00:00Z`; date-only strings are rejected. When `interval` is omitted, the live tool currently returns `5minute` bars. `interval=day` works for multi-year analysis but the live service rejects ranges estimated above 5,000 bars, so long lookbacks should use `week`/`month` or chunked daily requests. Historical comparisons can include benchmark symbols such as `SPY`; bars before a symbol has real data may be returned as `interpolated: true` gap-fill rows and should usually be ignored for analytics.

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
  equityHistoricalResults:
    - symbol: AAPL
      interval: day
      bounds: regular
      bars:
        - begins_at: "2025-12-29T00:00:00Z"
          open_price: "198.00"
          close_price: "200.00"
          high_price: "201.50"
          low_price: "197.25"
          volume: 42000000
          session: reg
    - symbol: SPY
      interval: day
      bounds: regular
      bars:
        - begins_at: "2025-12-29T00:00:00Z"
          open_price: "585.00"
          close_price: "589.50"
          high_price: "590.00"
          low_price: "584.25"
          volume: 58000000
          session: reg
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
