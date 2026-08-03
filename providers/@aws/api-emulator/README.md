# @api-emulator/aws

AWS provides cloud infrastructure APIs for storage, queues, identity, compute, and managed services.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/aws
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@aws/api-emulator/src/index.ts --service aws
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
aws:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
