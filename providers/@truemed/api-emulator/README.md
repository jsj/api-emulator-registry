# @api-emulator/truemed

Truemed provides HSA/FSA payment APIs for checkout sessions, payment tokens, qualification sessions, product catalog eligibility, captures, voids, and refunds.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/truemed
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@truemed/api-emulator.mjs --service truemed
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /payments/v1/create_payment_session`
- `GET /payments/v1/payment_session/:businessId`
- `GET /payments/v1/payment_sessions`
- `POST /payments/v1/payment_session/:businessId/capture`
- `POST /payments/v1/payment_session/:businessId/cancel`
- `POST /payments/v1/payment_session/:businessId/void`
- `POST /payments/v1/refund`
- `POST /api/v1/payment_tokens/create`
- `GET /api/v1/payment_tokens/:paymentToken`
- `GET /api/v1/payment_tokens`
- `POST /api/v1/payment_tokens/:paymentToken/update`
- `POST /api/v1/payment_tokens/:paymentToken/delete`
- `GET /api/v1/payment_tokens/provision_request/:provisionTokenRequestId`
- `GET /api/v1/qualification_session/:qualificationSessionId`
- `GET /api/v1/qualification_sessions`
- `POST /api/v1/product_catalog/truemed_checkout_method`
- `POST /api/v1/product_catalog/items/create`
- `POST /api/v1/product_catalog/items/update`
- `POST /api/v1/product_catalog/items/detail`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
truemed:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.truemed.com/openapi.json)
- [api-emulator](https://github.com/jsj/api-emulator)
