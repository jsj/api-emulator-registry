# @api-emulator/stripe

Stripe provides payments and billing APIs for customers, checkout, payment intents, invoices, and subscriptions.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/stripe
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@stripe/api-emulator/src/index.ts --service stripe
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
stripe:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
