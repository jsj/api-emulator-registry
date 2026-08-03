# @api-emulator/playstation

PlayStation publishing-style APIs provide Content Pipeline concepts, products, variants, assets, and publish history workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/playstation
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@playstation/api-emulator.mjs --service playstation
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /api/v1/concepts/count`
- `GET /api/v1/concepts`
- `POST /api/v1/create/concepts/products`
- `GET /api/v1/concepts/:conceptId`
- `GET /api/v1/concepts/:conceptId/products`
- `POST /api/v1/create/concepts/products/add`
- `GET /api/v1/concepts/products/:productId`
- `GET /api/v1/products/count`
- `GET /api/v1/products/details`
- `POST /api/v1/create/concepts/products/variant`
- `POST /api/v1/create/concepts/products/variant/metadata`
- `GET /api/v1/concepts/:conceptId/products/:productId/variant/:variantId/metadata`
- `GET /api/v1/concepts/:conceptId/products/:productId/variant/:variantId/preview`
- `GET /api/v1/assets`
- `GET /api/v1/assets/statuses`
- `GET /api/v1/assets/:assetId`
- `GET /api/v1/contentservice/publishinfo/search`
- `POST /api/v1/contentservice/publish`
- `GET /api/v1/publishHistory`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
playstation:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://partners.playstation.net/)
- [api-emulator](https://github.com/jsj/api-emulator)
