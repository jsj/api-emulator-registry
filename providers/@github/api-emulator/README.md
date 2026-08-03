# @api-emulator/github

GitHub provides source hosting, repositories, issues, pull requests, Actions, checks, and git data.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/github
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@github/api-emulator/src/index.ts --service github
```

## Fidelity

- Tier: `contract-backed`
- Evidence: 64% low conformance score
- Smoke: `node @github/smoke.mjs`
- Contract checks: `node scripts/check-github-openapi-coverage.mjs`

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
github:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.github.com/en/rest)
- [api-emulator](https://github.com/jsj/api-emulator)
