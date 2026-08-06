# @api-emulator/goodreads

Goodreads provides historical XML APIs for book search, book details, authors, and user review lists.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/goodreads
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@goodreads/api-emulator.mjs --service goodreads
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /search/index.xml`
- `GET /book/show/:id.xml`
- `GET /author/show/:id.xml`
- `GET /review/list/:userId.xml`
- `GET /goodreads/inspect/state`
- `GET /api`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
goodreads:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.goodreads.com/api)
- [api-emulator](https://github.com/jsj/api-emulator)
