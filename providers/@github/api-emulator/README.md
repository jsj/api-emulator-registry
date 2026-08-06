# @api-emulator/github

GitHub provides source hosting, repositories, issues, pull requests, Actions, checks, and git data.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/github
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@github/api-emulator/src/index.ts --service github
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

The emulator source lists the supported local API endpoints.

## Coverage

- Level: `contract-backed`
- Meaning: Automated tests compare this emulator with a defined API contract.
- Evidence: 64% low conformance score.
- Smoke: `node providers/@github/smoke.mjs`
- Contract checks: `node scripts/check-github-openapi-coverage.mjs`

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
github:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.github.com/en/rest)
- [api-emulator](https://github.com/jsj/api-emulator)
