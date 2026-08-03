# @api-emulator/okta

Okta provides identity APIs for OAuth, users, groups, apps, sessions, and identity providers.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/okta
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@okta/api-emulator/src/index.ts --service okta
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
okta:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
