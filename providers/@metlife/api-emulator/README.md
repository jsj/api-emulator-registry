# @api-emulator/metlife

MetLife APIs provide needs analysis, product recommendation, quote illustration, and life application submission workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/metlife
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@metlife/api-emulator.mjs --service metlife
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/products`
- `POST /v1/needs-analysis`
- `POST /v1/quote-illustrations`
- `GET /v1/quote-illustrations/:quoteId`
- `POST /v1/applications`
- `GET /v1/applications/:applicationId`
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
metlife:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://emea.developer.metlife.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
