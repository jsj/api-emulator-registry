# @api-emulator/finnhub

Finnhub provides financial market data APIs for market news, company news, symbols, quotes, and fundamentals.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/finnhub
```

## Run

```bash
npx -p api-emulator api --plugin ./@finnhub/api-emulator.mjs --service finnhub
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET ${prefix}/news`
- `GET ${prefix}/company-news`
- `GET /inspect/contract`
- `GET /inspect/state`

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
finnhub:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://finnhub.io/docs/api/market-news)
- [api-emulator](https://github.com/jsj/api-emulator)
