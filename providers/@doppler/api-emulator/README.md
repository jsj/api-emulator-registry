# @api-emulator/doppler

Doppler provides secrets management APIs for projects, configs, secret reads, and secret downloads.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/doppler
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@doppler/api-emulator.mjs --service doppler
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v3/projects`
- `GET /v3/configs`
- `GET /v3/configs/config/secrets`
- `GET /v3/configs/config/secret`
- `GET /v3/configs/config/secrets/download`
- `GET /doppler/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
doppler:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.doppler.com/reference/api)
- [api-emulator](https://github.com/jsj/api-emulator)
