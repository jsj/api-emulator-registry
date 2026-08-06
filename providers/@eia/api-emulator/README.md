# @api-emulator/eia

EIA Open Data API v2 provides energy fundamentals data routes for oil, gas, power, and inventory-sensitive workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/eia
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@eia/api-emulator.mjs --service eia
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /inspect/contract`
- `GET /v2/:route{.+}/data/`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
eia:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.eia.gov/opendata/documentation.php)
- [api-emulator](https://github.com/jsj/api-emulator)
