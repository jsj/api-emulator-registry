# @api-emulator/replit

Replit provides extension Data API and GraphQL surfaces for users, Repls, and extension public key workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/replit
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@replit/api-emulator.mjs --service replit
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /graphql`
- `GET /data/extensions/publicKey/:kid`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
replit:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.replit.com/extensions/api/data)
- [api-emulator](https://github.com/jsj/api-emulator)
