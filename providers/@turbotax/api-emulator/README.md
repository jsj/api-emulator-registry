# @api-emulator/turbotax

TurboTax partner tax-import APIs provide OAuth, tax document, and import session workflows for deterministic tax prep testing.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/turbotax
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@turbotax/api-emulator.mjs --service turbotax
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /oauth2/v1/tokens/bearer`
- `GET /v1/tax-documents`
- `POST /v1/tax-documents`
- `GET /v1/tax-documents/:id`
- `POST /v1/import-sessions`
- `GET /v1/import-sessions/:id`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
turbotax:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.intuit.com/partners/fdp/implementation-support/tax-import/)
- [api-emulator](https://github.com/jsj/api-emulator)
