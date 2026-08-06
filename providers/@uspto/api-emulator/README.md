# @api-emulator/uspto

USPTO provides Open Data Portal patent assignment and TSDR-compatible trademark status APIs.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/uspto
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@uspto/api-emulator.mjs --service uspto
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /inspect/contract`
- `GET /api/v1/patent/applications/:applicationNumber/assignment`
- `GET /ts/cd/casestatus/:serialNumber/info.json`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
uspto:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://data.uspto.gov/apis/getting-started)
- [api-emulator](https://github.com/jsj/api-emulator)
