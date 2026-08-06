# @api-emulator/microsoft

Microsoft provides identity, tenant, user, and productivity APIs through Microsoft Graph-style surfaces.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/microsoft
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@microsoft/api-emulator/src/index.ts --service microsoft
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

The emulator source lists the supported local API endpoints.

## Coverage

- Level: `stub`
- Meaning: This emulator has a small starter API.
- Evidence: starter surface without smoke coverage.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
microsoft:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
