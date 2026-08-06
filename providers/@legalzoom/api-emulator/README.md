# @api-emulator/legalzoom

LegalZoom provides legal-services workflows for customers, products, orders, business formations, and generated documents.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/legalzoom
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@legalzoom/api-emulator.mjs --service legalzoom
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/customers`
- `POST /v1/customers`
- `GET /v1/products`
- `GET /v1/orders`
- `POST /v1/orders`
- `GET /v1/orders/:orderId`
- `POST /v1/business-formations`
- `GET /v1/business-formations/:formationId`
- `GET /v1/orders/:orderId/documents`
- `GET /v1/documents/:documentId`
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
legalzoom:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.legalzoom.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
