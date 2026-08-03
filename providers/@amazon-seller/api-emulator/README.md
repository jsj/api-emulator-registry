# @api-emulator/amazon-seller

Amazon Selling Partner API provides seller marketplace, orders, inventory, and restricted data token workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/amazon-seller
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@amazon-seller/api-emulator.mjs --service amazon-seller
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /auth/o2/token`
- `GET /sellers/v1/marketplaceParticipations`
- `GET /orders/v0/orders`
- `GET /orders/v0/orders/:orderId`
- `POST /tokens/2021-03-01/restrictedDataToken`
- `GET /amazon-seller/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
amazon-seller:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer-docs.amazon.com/sp-api)
- [api-emulator](https://github.com/jsj/api-emulator)
