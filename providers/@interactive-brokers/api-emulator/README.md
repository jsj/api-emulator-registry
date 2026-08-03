# @api-emulator/interactive-brokers

Interactive Brokers Client Portal Web API provides session, accounts, portfolio, market data, contract search, and order workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/interactive-brokers
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@interactive-brokers/api-emulator.mjs --service interactive-brokers
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /oauth2/api/v1/token`
- `GET /iserver/auth/status`
- `POST /iserver/reauthenticate`
- `GET /iserver/accounts`
- `GET /portfolio/accounts`
- `GET /portfolio/subaccounts`
- `GET /portfolio/:accountId/positions/:pageId`
- `GET /portfolio/:accountId/ledger`
- `GET /portfolio/:accountId/summary`
- `GET /iserver/secdef/search`
- `GET /iserver/marketdata/snapshot`
- `GET /iserver/account/orders`
- `POST /iserver/account/:accountId/orders`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
interactive-brokers:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.interactivebrokers.com/campus/ibkr-api-page/cpapi-v1/)
- [api-emulator](https://github.com/jsj/api-emulator)
