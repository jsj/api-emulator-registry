# @api-emulator/polymarket

Local REST fixtures for the official Polymarket TypeScript SDK and CLI. This covers a defined subset of Gamma, CLOB and Data APIs, not the full exchange or Polymarket US.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/polymarket
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@polymarket/api-emulator.mjs --service polymarket
```

Use the printed local URL with `/gamma`, `/clob`, and `/data` for the three service roots. Unprefixed routes remain available for existing callers. The pinned CLI fork accepts service prefixes with or without a trailing slash.

## Supported API

| Surface | Supported behavior |
| --- | --- |
| Gamma | Market list, keyset pagination, ID/slug lookup, active/closed/archived filters, event list/lookup, public search |
| CLOB data | Single/batch books, prices, midpoints, spreads, last trade prices; tick size, negative risk, fee rate, token-to-condition lookup, market metadata, fixed price history, health/time |
| CLOB orders | Fixture API-key authentication, resting GTC/GTD order creation, order lookup/list/filter, single/batch/all cancellation, empty trade history |
| Data | Legacy positions/value plus SDK v2 positions/value with response envelopes, user filtering, position status and condition filters |
| Controls | `POST /control/markets`, `GET /inspect/markets`, `GET /inspect/requests` (legacy market lookup/list log) |

## Coverage

SDK-tested REST subset. HTTP regression tests check errors, wallet isolation and state transitions. Official clients check response parsing and serialization.

Unsupported: matching/fills, crossing and FOK/FAK orders, settlement/redemption, onchain calls, WebSockets, market making/rewards, bridge, perps, combos, social endpoints, and full query-filter parity. GTD validates expiration against fixture time but has no expiry scheduler. Unsupported order modes return errors. Books contain fixed synthetic depth; resting orders do not modify it. Price history contains two fixed samples, not interval/fidelity resampling.

## Credentials

The API credentials exported by `src/routes/orders.mjs` are local fixtures. Private routes check fixture headers and isolate orders by wallet address. They do **not** verify cryptographic signatures, wallet ownership, balances or allowances. Do not use production credentials.

## Test data

Two deterministic markets use token IDs `1001`–`1004`. The fixture wallet `0x1111111111111111111111111111111111111111` holds 10 YES shares of token `1001`, bought at 0.50 and marked at 0.58. Other wallets have empty portfolios. Positions are fixtures independent of orders; posting an order does not fill it or change positions. Add market fixtures through `POST /control/markets`.

## Official client verification

Pinned evidence:

- TypeScript: `@polymarket/client@0.10.0`; source [`542202c`](https://github.com/Polymarket/ts-sdk/tree/542202c28f43b38a226cd60e309277e2a92fc8af).
- CLI: fork [`8e8f8c0`](https://github.com/jsj/polymarket-cli/tree/8e8f8c0c5b4714b4098c73946f2ef0de3e012488), based on official source `9b18b5f`, with Gamma/Data host overrides and URL normalization. Its lockfile uses official Rust SDK `0.5.1`.

The latest downloadable CLI release checked, `v0.1.5`, ignores `POLYMARKET_CLOB_HOST`. The official main revision supports CLOB overrides but uses fixed Gamma/Data URLs. Our pinned fork supports `POLYMARKET_GAMMA_HOST`, `POLYMARKET_DATA_HOST`, and `POLYMARKET_CLOB_HOST`, retaining production defaults. The CLI suite now verifies Gamma listing/search, Data positions/value, and CLOB reads. The official TypeScript SDK also verifies these services and the resting order lifecycle.

Upstream contribution: [Polymarket/polymarket-cli#87](https://github.com/Polymarket/polymarket-cli/pull/87). Keep the fork pin until an official release includes the overrides.

Build the exact CLI revision in a separate checkout:

```bash
git clone https://github.com/jsj/polymarket-cli.git
cd polymarket-cli
git checkout --detach 8e8f8c0c5b4714b4098c73946f2ef0de3e012488
cargo build --locked
```

```bash
# Registry root: HTTP behavior, invalid requests, authentication and wallet isolation
node providers/@polymarket/smoke.mjs

# SDK parsing, pagination, search, pricing, portfolio and order lifecycle
cd providers/@polymarket/verification
npm ci --ignore-scripts
npm test

# Use the pinned fork binary built above
POLYMARKET_CLI_BIN=/absolute/path/to/polymarket-cli/target/debug/polymarket npm run test:cli
```

`verification/package-lock.json` pins test dependencies; the emulator itself adds no npm dependencies. The CLI test asserts that each command reaches the local server. It does not exercise wallet setup, trading CLI commands or onchain operations.

Configure the TypeScript SDK with `forkEnvironmentConfig` and `{ gamma: { rest: localUrl + '/gamma' }, clob: { rest: localUrl + '/clob' }, data: { rest: localUrl + '/data' } }` plus a local environment name. See `verification/sdk.mjs` for a complete example with fixture authentication.

## Links

- [Official API docs](https://docs.polymarket.com)
- [api-emulator](https://github.com/jsj/api-emulator)
