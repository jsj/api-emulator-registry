# @api-emulator/openfda

openFDA provides drug event, enforcement, label, Drugs@FDA, and shortage APIs for healthcare and regulatory workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/openfda
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@openfda/api-emulator.mjs --service openfda
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /inspect/contract`
- `GET /drug/event.json`
- `GET /drug/enforcement.json`
- `GET /drug/label.json`
- `GET /drug/drugsfda.json`
- `GET /drug/shortages.json`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
openfda:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://open.fda.gov/apis/)
- [api-emulator](https://github.com/jsj/api-emulator)
