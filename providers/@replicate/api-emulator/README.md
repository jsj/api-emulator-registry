# @api-emulator/replicate

Replicate provides model metadata and deterministic prediction APIs with local image and video outputs.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/replicate
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@replicate/api-emulator.mjs --service replicate
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

The emulator source lists the supported local API endpoints.

## Coverage

- Level: `contract-backed`
- Meaning: Automated tests compare this emulator with a defined API contract.
- Evidence: 65% medium conformance score.
- Smoke: `node providers/@replicate/smoke.mjs`

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
replicate:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
