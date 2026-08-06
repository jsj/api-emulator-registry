# @api-emulator/govinfo

GovInfo provides package collection, summary, and content APIs for official U.S. government publications.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/govinfo
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@govinfo/api-emulator.mjs --service govinfo
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /inspect/contract`
- `GET /collections/:collection/:startDate`
- `GET /packages/:packageId/summary`
- `GET /packages/:packageId/:format`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
govinfo:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.govinfo.gov/docs/)
- [api-emulator](https://github.com/jsj/api-emulator)
