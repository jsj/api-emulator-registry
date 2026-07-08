# @api-emulator/alpha-vantage

Alpha Vantage provides stock quote, time series, symbol search, and market status data through a query-parameter API.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/alpha-vantage
```

## Run

```bash
npx -p api-emulator api --plugin ./@alpha-vantage/api-emulator.mjs --service alpha-vantage
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET /query`
- `GET /inspect/contract`
- `GET /inspect/state`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
alpha-vantage:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.alphavantage.co/documentation/)
- [api-emulator](https://github.com/jsj/api-emulator)
