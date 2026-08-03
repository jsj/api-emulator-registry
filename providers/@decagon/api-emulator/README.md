# @api-emulator/decagon

Decagon provides AI customer-support APIs for outbound chat messages and support automation workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/decagon
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@decagon/api-emulator.mjs --service decagon
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /chat/outbound`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
decagon:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.decagon.ai/api-reference/getting-started)
- [api-emulator](https://github.com/jsj/api-emulator)
