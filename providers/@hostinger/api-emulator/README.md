# @api-emulator/hostinger

Hostinger provides VPS, DNS, domain, account, and hosting infrastructure APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/hostinger
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@hostinger/api-emulator.mjs --service hostinger
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface with smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
hostinger:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.hostinger.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
