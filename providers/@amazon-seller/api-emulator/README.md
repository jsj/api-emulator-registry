# @api-emulator/amazon-seller

Amazon Selling Partner API provides seller marketplace, orders, inventory, and restricted data token workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/amazon-seller
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@amazon-seller/api-emulator.mjs --service amazon-seller
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /auth/o2/token`
- `GET /sellers/v1/marketplaceParticipations`
- `GET /orders/v0/orders`
- `GET /orders/v0/orders/:orderId`
- `POST /tokens/2021-03-01/restrictedDataToken`
- `GET /amazon-seller/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
amazon-seller:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer-docs.amazon.com/sp-api)
- [api-emulator](https://github.com/jsj/api-emulator)
