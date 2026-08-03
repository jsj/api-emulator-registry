# @api-emulator/auth0

Auth0 provides authentication, authorization, user management, tokens, and tenant configuration.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/auth0
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@auth0/api-emulator/src/index.ts --service auth0
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
auth0:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
