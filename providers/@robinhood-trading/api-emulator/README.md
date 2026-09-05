# @api-emulator/robinhood-trading

Robinhood Agentic Trading MCP provides account, portfolio, market data, watchlist, scanner, alert, news, SEC filing, and order APIs. It supports equities, options, and crypto.

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

## September 5, 2026 sync

The authenticated live `tools/list` capture contains 73 tools. All 73 are exposed by the emulator and exercised by its smoke test. The 19 additions include eight crypto tools (including onboarding), six alert tools, and five news/SEC research tools.

Crypto uses `rhs_account_number` from `get_accounts`, distinct from the `account_number` used for equities/options. The default synthetic crypto account uses `900000006`. Preview, place, and cancel require an accessible agentic account. Crypto orders validate size, price increments, type, time in force, buying power, holdings, and account ownership. Open orders reserve funds or sell quantity; cancellation releases those reservations. `ref_id` retries return the original order.

Default crypto balances, quotes, alerts, and research are synthetic. Seed `cryptoAccounts`, `currencyPairs`, `cryptoQuotes`, `cryptoPositions`, `cryptoOrders`, `alerts`, `alertLog`, and `research` through provider configuration as needed. `cryptoAccounts` links `rhs_account_number` to `account_id` and `crypto_account_number`, with `buying_power` and a decimal `fee_rate` (for example `0.0035`).

### Capture and validation

```bash
node providers/@robinhood-trading/scripts/capture-tools-contract.mjs
node providers/@robinhood-trading/scripts/capture-crypto.mjs
node providers/@robinhood-trading/scripts/check-live-reads.mjs
node providers/@robinhood-trading/smoke.mjs
node providers/@robinhood-trading/smoke-cli.mjs
node --test providers/@robinhood-trading/crypto-tools.test.mjs providers/@robinhood-trading/extended-tools.test.mjs
```

The crypto capture reads accounts, pairs, quotes, onboarding, positions, and orders. A non-placing `preview_crypto_order` call requires the explicit `--include-preview` flag. It never places or cancels a live order. Raw account responses stay under gitignored `.emu/`; the committed evidence contains public market data and response field names only. On September 5, all six reads succeeded; the live preview returned an insufficient-buying-power error. Successful order lifecycles are tested locally, not verified through live trades.

### Full local validation

```bash
npm run test:robinhood-trading
```

This runs the all-73-tool smoke test, crypto and extended-tool regression tests, and a packaging test. The packaging test uses the release bundler, creates and extracts a local npm tarball, runs every tool from the extracted package, and uses `mcporter` over localhost to test discovery plus crypto preview/place/list/cancel. It does not publish or contact Robinhood. Bun, npm, and tar are required; mcporter is obtained through npx.

On September 5, eight additional read-only live calls across seven alert/news/SEC tools passed today's output schemas. See `fixtures/read-validation.sanitized.json`; response values remain private. These checks cover bounded reads, not full production behavior or write parity. Regression coverage includes account/store isolation, reservations, tiny quantity increments, polling timestamps, alert limits and deletion, and SEC dimensions and distinct reporting periods.

### Simulation limits

Orders remain queued until canceled or seeded with another state; the emulator does not execute fills or run a matching engine. Cancellation completes synchronously locally, while Robinhood's cancellation is asynchronous. Fee calculations use a configured fixed rate, without live routing, collaring, taxes, or approval workflows. Quote timezone inputs are validated, but seeded timestamps and previous close remain fixed. Alerts do not monitor markets or send notifications. News and SEC content are synthetic fixtures, not live research.

The default account, portfolio, and watchlist fixture is entirely synthetic. The legacy `scripts/sanitize-fixtures.mjs` command ignores private capture input and copies only this synthetic fixture. Live account responses must remain under the ignored `.emu/` directory; replacing identifiers alone does not remove personal financial information.
