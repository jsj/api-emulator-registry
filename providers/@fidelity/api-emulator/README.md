# @api-emulator/fidelity

Fidelity WorkplaceXchange provides workplace participant, retirement, stock-plan, HSA balance, and pay statement APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/fidelity
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@fidelity/api-emulator.mjs --service fidelity
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /wpx/oauth2/token`
- `GET /wpx/hrp/v1/participants`
- `GET /wpx/hrp/v1/participants/:participantId`
- `GET /wpx/wi/v1/participants/:participantId/balances`
- `GET /wpx/hrp/v1/participants/:participantId/pay-statements`
- `POST /wpx/hrp/v1/participants`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
fidelity:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://workplacexchange.fidelity.com/public/wpx/docs/wi-balances)
- [api-emulator](https://github.com/jsj/api-emulator)
