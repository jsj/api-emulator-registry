# @api-emulator/gcp

Google Cloud Platform provides cloud resource, compute, service usage, billing, IAM, and gcloud-oriented infrastructure APIs.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/gcp
```

## Run

```bash
npx -p api-emulator api --plugin ./@gcp/api-emulator.mjs --service gcp
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET /v1/projects`
- `POST /v1/projects`
- `GET /v1/projects/:projectId`
- `DELETE /v1/projects/:projectId`
- `GET /v3/projects`
- `POST /v3/projects`
- `GET /v3/projects/:projectId`
- `DELETE /v3/projects/:projectId`
- `GET /compute/v1/projects/:projectId/zones`
- `GET /compute/v1/projects/:projectId/zones/:zone/instances`
- `POST /compute/v1/projects/:projectId/zones/:zone/instances`
- `GET /compute/v1/projects/:projectId/zones/:zone/instances/:instance`
- `GET /v1/projects/:projectId/services`
- `GET /v1/projects/:projectId/services/:serviceName`
- `GET /gcp/inspect/state`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
gcp:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.cloud.google.com/sdk/docs/install-sdk)
- [api-emulator](https://github.com/jsj/api-emulator)
