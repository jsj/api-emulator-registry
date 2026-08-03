# @api-emulator/modal

Modal provides serverless Python compute control-plane APIs for apps, environments, secrets, volumes, workspaces, and tokens.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/modal
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@modal/api-emulator.mjs --service modal
```

## Fidelity

- Tier: `contract-backed`
- Evidence: 65% medium conformance score
- Smoke: `node @modal/smoke.mjs`

## Endpoints

- `GET /modal/inspect/state`
- `POST /modal/inspect/reset`
- `POST /modal/forge/inference`
- `GET /modal/v1/token/info`
- `GET /modal/v1/workspace`
- `GET /modal/v1/environments`
- `POST /modal/v1/environments`
- `GET /modal/v1/apps`
- `POST /modal/v1/apps`
- `GET /modal/v1/apps/:app_id`
- `PATCH /modal/v1/apps/:app_id`
- `DELETE /modal/v1/apps/:app_id`
- `GET /modal/v1/secrets`
- `POST /modal/v1/secrets`
- `GET /modal/v1/volumes`
- `POST /modal/v1/volumes`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
modal:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://modal.com/docs/reference)
- [api-emulator](https://github.com/jsj/api-emulator)
