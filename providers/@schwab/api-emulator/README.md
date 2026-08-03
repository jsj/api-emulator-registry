# @api-emulator/schwab

Charles Schwab Trader API provides OAuth, brokerage accounts, account hashes, orders, quotes, and option chain data.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/schwab
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@schwab/api-emulator.mjs --service schwab
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /v1/oauth/token`
- `GET /trader/v1/accounts/accountNumbers`
- `GET /trader/v1/accounts`
- `GET /trader/v1/accounts/:accountHash/orders`
- `POST /trader/v1/accounts/:accountHash/orders`
- `GET /trader/v1/accounts/:accountHash/orders/:orderId`
- `GET /marketdata/v1/quotes`
- `GET /marketdata/v1/chains`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
schwab:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.schwab.com/products/trader-api--individual)
- [api-emulator](https://github.com/jsj/api-emulator)
