# @api-emulator/vercel

Vercel provides deployment platform APIs for projects, builds, domains, environment variables, teams, and accounts.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/vercel
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@vercel/api-emulator/src/index.ts --service vercel
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface without smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
vercel:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
