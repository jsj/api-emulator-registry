# @api-emulator/github

GitHub provides source hosting, repositories, issues, pull requests, Actions, checks, and git data.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/github
```

## Run

```bash
npx -p api-emulator api --plugin ./@github/api-emulator/src/index.ts --service github
```

## Fidelity

- Tier: `contract-backed`
- Evidence: 64% low conformance score
- Smoke: `node @github/smoke.mjs`
- Contract checks: `node scripts/check-github-openapi-coverage.mjs`

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
github:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.github.com/en/rest)
- [api-emulator](https://github.com/jsj/api-emulator)
