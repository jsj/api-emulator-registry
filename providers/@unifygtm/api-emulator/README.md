# @api-emulator/unifygtm

Unify GTM provides data APIs for GTM objects, attributes, records, enrichment, and workflow automation.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/unifygtm
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@unifygtm/api-emulator.mjs --service unifygtm
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface with smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
unifygtm:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.unifygtm.com/developers/api/data/overview)
- [api-emulator](https://github.com/jsj/api-emulator)
