# @api-emulator/adyen

Adyen is a payments platform for checkout, payment methods, transaction processing, and payouts.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/adyen
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@adyen/api-emulator.mjs --service adyen
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
adyen:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
