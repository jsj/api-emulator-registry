# @api-emulator/shipstation

ShipStation provides shipping APIs for shipments, rates, labels, tracking, and fulfillment workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/shipstation
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@shipstation/api-emulator.mjs --service shipstation
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v2/shipments`
- `POST /v2/shipments`
- `GET /v2/shipments/:id`
- `POST /v2/rates`
- `POST /v2/labels`
- `GET /shipstation/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
shipstation:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.shipstation.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
