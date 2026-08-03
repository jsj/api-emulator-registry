# @api-emulator/argo

Argo Workflows provides workflow orchestration APIs for submitting, listing, inspecting, and deleting Kubernetes-native workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/argo
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@argo/api-emulator.mjs --service argo
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /api/v1/info`
- `GET /api/v1/userinfo`
- `GET /api/v1/workflows/:namespace`
- `POST /api/v1/workflows/:namespace`
- `POST /api/v1/workflows/:namespace/submit`
- `GET /api/v1/workflows/:namespace/:name`
- `DELETE /api/v1/workflows/:namespace/:name`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
argo:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://argo-workflows.readthedocs.io/en/latest/swagger/)
- [api-emulator](https://github.com/jsj/api-emulator)
