# @api-emulator/mercury

Mercury provides banking APIs for accounts, transactions, recipients, and payment approval workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/mercury
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@mercury/api-emulator.mjs --service mercury
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET ${prefix}/accounts`
- `GET ${prefix}/account/:accountId`
- `GET ${prefix}/transactions`
- `GET ${prefix}/transaction/:transactionId`
- `GET ${prefix}/recipients`
- `POST ${prefix}/recipients`
- `GET ${prefix}/recipient/:recipientId`
- `POST ${prefix}/recipient/:recipientId`
- `POST ${prefix}/account/:accountId/request-send-money`
- `POST ${prefix}/account/:accountId/transactions`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
mercury:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.mercury.com/docs/welcome)
- [api-emulator](https://github.com/jsj/api-emulator)
