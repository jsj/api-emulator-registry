# @api-emulator/microsoft

Microsoft provides identity, tenant, user, and productivity APIs through Microsoft Graph-style surfaces.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/microsoft
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@microsoft/api-emulator/src/index.ts --service microsoft
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
microsoft:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
