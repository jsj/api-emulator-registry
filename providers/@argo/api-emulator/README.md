# @api-emulator/argo

Argo Workflows provides workflow orchestration APIs for submitting, listing, inspecting, and deleting Kubernetes-native workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/argo
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@argo/api-emulator.mjs --service argo
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/v1/info`
- `GET /api/v1/userinfo`
- `GET /api/v1/workflows/:namespace`
- `POST /api/v1/workflows/:namespace`
- `POST /api/v1/workflows/:namespace/submit`
- `GET /api/v1/workflows/:namespace/:name`
- `DELETE /api/v1/workflows/:namespace/:name`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
argo:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://argo-workflows.readthedocs.io/en/latest/swagger/)
- [api-emulator](https://github.com/jsj/api-emulator)
