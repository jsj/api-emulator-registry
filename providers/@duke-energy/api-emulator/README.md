# @api-emulator/duke-energy

Duke Energy customer APIs provide Auth0 token exchange, account lists, account details, balances, meters, and usage graph workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/duke-energy
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@duke-energy/api-emulator.mjs --service duke-energy
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /login/auth-token`
- `GET /account-list`
- `GET /account-details-v2`
- `POST /account/usage/graph`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
duke-energy:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/hunterjm/aiodukeenergy)
- [api-emulator](https://github.com/jsj/api-emulator)
