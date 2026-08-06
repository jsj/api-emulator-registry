# @api-emulator/paypal

PayPal provides payments APIs for OAuth, checkout orders, captures, refunds, webhooks, and transaction workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/paypal
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@paypal/api-emulator.mjs --service paypal
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /v1/oauth2/token`
- `POST /v2/checkout/orders`
- `GET /v2/checkout/orders/:id`
- `POST /v2/checkout/orders/:id/capture`
- `GET /v2/payments/captures/:id`
- `POST /v2/payments/captures/:id/refund`
- `GET /v2/payments/refunds/:id`
- `GET /paypal/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
paypal:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.paypal.com/docs/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
