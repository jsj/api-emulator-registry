# @api-emulator/applovin

AppLovin provides marketing and reporting APIs for campaigns, ads, revenue, spend, and performance metrics.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/applovin
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@applovin/api-emulator.mjs --service applovin
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /report`
- `GET /maxReport`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
applovin:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.applovin.com)
- [api-emulator](https://github.com/jsj/api-emulator)
