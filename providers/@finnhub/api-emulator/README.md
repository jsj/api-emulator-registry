# @api-emulator/finnhub

Finnhub provides financial market data APIs for market news, company news, symbols, quotes, and fundamentals.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/finnhub
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@finnhub/api-emulator.mjs --service finnhub
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET ${prefix}/news`
- `GET ${prefix}/company-news`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
finnhub:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://finnhub.io/docs/api/market-news)
- [api-emulator](https://github.com/jsj/api-emulator)
