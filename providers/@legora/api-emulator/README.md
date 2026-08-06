# @api-emulator/legora

Legora provides legal workspace APIs for matters, documents, workflows, review tables, and AI completions.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/legora
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@legora/api-emulator.mjs --service legora
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/workspace`
- `GET /v1/matters`
- `POST /v1/matters`
- `GET /v1/matters/:matterId/documents`
- `POST /v1/matters/:matterId/documents`
- `GET /v1/workflows`
- `POST /v1/workflows/:workflowId/runs`
- `GET /v1/review-tables/:tableId`
- `POST /v1/chat/completions`
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
legora:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://legora.com/product)
- [api-emulator](https://github.com/jsj/api-emulator)
