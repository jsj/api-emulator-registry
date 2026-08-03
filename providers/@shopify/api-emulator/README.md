# @api-emulator/shopify

Shopify Admin APIs provide shop, products, orders, inventory, customers, and GraphQL commerce workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/shopify
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@shopify/api-emulator.mjs --service shopify
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /admin/api/:version/shop.json`
- `GET /admin/api/:version/products.json`
- `POST /admin/api/:version/products.json`
- `GET /admin/api/:version/products/:id.json`
- `GET /admin/api/:version/orders.json`
- `POST /admin/api/:version/graphql.json`
- `GET /shopify/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
shopify:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://shopify.dev/docs/api)
- [api-emulator](https://github.com/jsj/api-emulator)
