# @api-emulator/mongoatlas

MongoDB Atlas provides managed database projects, clusters, admin APIs, and data access surfaces.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/mongoatlas
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@mongoatlas/api-emulator/src/index.ts --service mongoatlas
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
mongoatlas:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
