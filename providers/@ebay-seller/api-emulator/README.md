# @api-emulator/ebay-seller

eBay Seller APIs provide OAuth, inventory item, offer, and marketplace selling workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/ebay-seller
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@ebay-seller/api-emulator.mjs --service ebay-seller
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /identity/v1/oauth2/token`
- `GET /sell/inventory/v1/inventory_item/:sku`
- `PUT /sell/inventory/v1/inventory_item/:sku`
- `GET /sell/inventory/v1/inventory_item`
- `POST /sell/inventory/v1/offer`
- `GET /ebay-seller/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
ebay-seller:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.ebay.com/api-docs)
- [api-emulator](https://github.com/jsj/api-emulator)
