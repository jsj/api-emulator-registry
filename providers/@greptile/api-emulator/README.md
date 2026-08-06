# @api-emulator/greptile

Greptile provides AI codebase indexing, semantic search, and repository question-answering APIs.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/greptile
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@greptile/api-emulator.mjs --service greptile
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /v2/repositories`
- `GET /v2/repositories/:repositoryId`
- `POST /v2/query`
- `POST /v2/search`
- `GET /greptile/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
greptile:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.greptile.com/docs/api-reference/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
