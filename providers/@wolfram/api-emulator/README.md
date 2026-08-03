# @api-emulator/wolfram

Wolfram APIs provide short answers, full query results, spoken results, and LLM-ready computational answers.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/wolfram
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@wolfram/api-emulator.mjs --service wolfram
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/result`
- `GET /v1/spoken`
- `GET /v1/simple`
- `GET /v2/query`
- `GET /api/v1/llm-api`
- `GET /wolfram/inspect/contract`
- `GET /wolfram/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
wolfram:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://products.wolframalpha.com/api)
- [api-emulator](https://github.com/jsj/api-emulator)
