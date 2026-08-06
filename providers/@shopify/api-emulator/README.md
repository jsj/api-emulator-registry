# @api-emulator/shopify

Shopify Admin APIs provide shop, products, orders, inventory, customers, and GraphQL commerce workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/shopify
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@shopify/api-emulator.mjs --service shopify
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /admin/api/:version/shop.json`
- `GET /admin/api/:version/products.json`
- `POST /admin/api/:version/products.json`
- `GET /admin/api/:version/products/:id.json`
- `GET /admin/api/:version/orders.json`
- `POST /admin/api/:version/graphql.json`
- `GET /shopify/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
shopify:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://shopify.dev/docs/api)
- [api-emulator](https://github.com/jsj/api-emulator)
