# @api-emulator/coreweave

CoreWeave provides Kubernetes Service APIs for CKS clusters, regions, node types, and kubeconfig workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/coreweave
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@coreweave/api-emulator.mjs --service coreweave
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1beta1/cks/clusters`
- `POST /v1beta1/cks/clusters`
- `GET /v1beta1/cks/clusters/:id`
- `PATCH /v1beta1/cks/clusters/:id`
- `DELETE /v1beta1/cks/clusters/:id`
- `GET /v1beta1/cks/clusters/:id/kubeconfig`
- `GET /v1beta1/cks/regions`
- `GET /v1beta1/cks/node-types`
- `GET /coreweave/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
coreweave:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.coreweave.com/products/cks/reference/cks-api)
- [api-emulator](https://github.com/jsj/api-emulator)
