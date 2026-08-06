# @api-emulator/playstation

PlayStation publishing-style APIs provide Content Pipeline concepts, products, variants, assets, and publish history workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/playstation
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@playstation/api-emulator.mjs --service playstation
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
playstation:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://partners.playstation.net/)
- [api-emulator](https://github.com/jsj/api-emulator)
