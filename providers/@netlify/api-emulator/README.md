# @api-emulator/netlify

Netlify provides web hosting APIs for sites, deploys, builds, environment variables, and domains.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/netlify
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@netlify/api-emulator.mjs --service netlify
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
netlify:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
