# @api-emulator/alpha-vantage

Alpha Vantage provides stock quote, time series, symbol search, and market status data through a query-parameter API.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/alpha-vantage
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@alpha-vantage/api-emulator.mjs --service alpha-vantage
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /query`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
alpha-vantage:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.alphavantage.co/documentation/)
- [api-emulator](https://github.com/jsj/api-emulator)
