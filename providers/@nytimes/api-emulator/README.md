# @api-emulator/nytimes

The New York Times APIs provide article search, archive, top stories, books, and public content datasets.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/nytimes
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@nytimes/api-emulator.mjs --service nytimes
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /svc/search/v2/articlesearch.json`
- `GET /svc/archive/v1/:year/:month.json`
- `GET /svc/topstories/v2/:section{.+}`
- `GET /svc/books/v3/lists/overview.json`
- `GET /svc/books/v3/lists/current/:list.json`
- `GET /fixtures/books/:isbn.svg`
- `GET /nytimes/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
nytimes:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.nytimes.com/apis)
- [api-emulator](https://github.com/jsj/api-emulator)
