# @api-emulator/neon

Neon provides serverless Postgres with projects, branches, databases, roles, endpoints, and previews.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/neon
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@neon/api-emulator.mjs --service neon
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface without smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
neon:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
