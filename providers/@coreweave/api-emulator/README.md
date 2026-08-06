# @api-emulator/coreweave

CoreWeave provides Kubernetes Service APIs for CKS clusters, regions, node types, and kubeconfig workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/coreweave
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@coreweave/api-emulator.mjs --service coreweave
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1beta1/cks/clusters`
- `POST /v1beta1/cks/clusters`
- `GET /v1beta1/cks/clusters/:id`
- `PATCH /v1beta1/cks/clusters/:id`
- `DELETE /v1beta1/cks/clusters/:id`
- `GET /v1beta1/cks/clusters/:id/kubeconfig`
- `GET /v1beta1/cks/regions`
- `GET /v1beta1/cks/node-types`
- `GET /coreweave/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
coreweave:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.coreweave.com/products/cks/reference/cks-api)
- [api-emulator](https://github.com/jsj/api-emulator)
