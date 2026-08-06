# @api-emulator/harvey

Harvey provides legal AI APIs for vault projects, documents, search, and legal-grade completions.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/harvey
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@harvey/api-emulator.mjs --service harvey
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/v1/vault/workspace/projects`
- `GET /api/v1/vault/projects/:projectId/documents`
- `GET /api/v1/vault/documents/:documentId`
- `POST /api/v1/vault/search`
- `POST /api/v1/completion`
- `POST /v2/completion`
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
harvey:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.harvey.ai/guides/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
