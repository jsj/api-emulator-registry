# @api-emulator/ebay-seller

eBay Seller APIs provide OAuth, inventory item, offer, and marketplace selling workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/ebay-seller
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@ebay-seller/api-emulator.mjs --service ebay-seller
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /identity/v1/oauth2/token`
- `GET /sell/inventory/v1/inventory_item/:sku`
- `PUT /sell/inventory/v1/inventory_item/:sku`
- `GET /sell/inventory/v1/inventory_item`
- `POST /sell/inventory/v1/offer`
- `GET /ebay-seller/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
ebay-seller:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.ebay.com/api-docs)
- [api-emulator](https://github.com/jsj/api-emulator)
