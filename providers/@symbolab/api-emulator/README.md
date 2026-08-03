# @api-emulator/symbolab

Symbolab public web bridge APIs provide equation solution, steps, answer verification, and graph plotting workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/symbolab
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@symbolab/api-emulator.mjs --service symbolab
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /pub_api/bridge/solution`
- `POST /pub_api/bridge/steps`
- `POST /pub_api/bridge/verify`
- `POST /pub_api/bridge/verifyProblem`
- `POST /pub_api/graph/plottingInfo`
- `GET /symbolab/inspect/contract`
- `GET /symbolab/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
symbolab:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.symbolab.com/solver/step-by-step-calculator)
- [api-emulator](https://github.com/jsj/api-emulator)
