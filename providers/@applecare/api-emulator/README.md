# @api-emulator/applecare

AppleCare coverage APIs provide organization device inventory, warranty coverage, service eligibility, and repair case workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/applecare
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@applecare/api-emulator.mjs --service applecare
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/orgDevices`
- `GET /v1/orgDevices/:deviceId`
- `GET /v1/orgDevices/:deviceId/appleCareCoverage`
- `GET /v1/coverage/:serialNumber`
- `POST /v1/repairCases`
- `GET /v1/repairCases/:caseId`
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
applecare:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://support.apple.com/guide/apple-business-manager/create-an-api-account-axm33189f66a/web)
- [api-emulator](https://github.com/jsj/api-emulator)
