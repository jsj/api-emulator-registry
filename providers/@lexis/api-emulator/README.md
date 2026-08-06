# @api-emulator/lexis

Lexis provides legal research APIs for sources, search, documents, folders, and Web Services API-compatible aliases.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/lexis
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@lexis/api-emulator.mjs --service lexis
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/me`
- `GET /v1/sources`
- `POST /v1/search`
- `GET /v1/documents/:documentId`
- `GET /v1/folders`
- `POST /v1/folders`
- `GET /wsapi/rest/sources`
- `POST /wsapi/rest/search`
- `GET /wsapi/rest/documents/:documentId`
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
lexis:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.lexisnexis.com/en-us/products/lexis-api.page)
- [api-emulator](https://github.com/jsj/api-emulator)
