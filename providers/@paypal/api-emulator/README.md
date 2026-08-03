# @api-emulator/paypal

PayPal provides payments APIs for OAuth, checkout orders, captures, refunds, webhooks, and transaction workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/paypal
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@paypal/api-emulator.mjs --service paypal
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /v1/oauth2/token`
- `POST /v2/checkout/orders`
- `GET /v2/checkout/orders/:id`
- `POST /v2/checkout/orders/:id/capture`
- `GET /v2/payments/captures/:id`
- `POST /v2/payments/captures/:id/refund`
- `GET /v2/payments/refunds/:id`
- `GET /paypal/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
paypal:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.paypal.com/docs/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
