# @api-emulator/privy

Privy provides embedded wallets, authentication, user identity, and authorization for crypto apps.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/privy
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@privy/api-emulator.mjs --service privy
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface without smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
privy:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.privy.io/)
- [api-emulator](https://github.com/jsj/api-emulator)
