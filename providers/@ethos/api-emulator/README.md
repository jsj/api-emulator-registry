# @api-emulator/ethos

Ethos-style life insurance APIs provide partner lead intake, term-life quotes, application decisions, and policy workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/ethos
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@ethos/api-emulator.mjs --service ethos
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/leads`
- `POST /v1/leads`
- `POST /v1/quotes/term-life`
- `GET /v1/quotes/:quoteId`
- `POST /v1/applications`
- `GET /v1/applications/:applicationId`
- `GET /v1/policies`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
ethos:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.ethos.com/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
