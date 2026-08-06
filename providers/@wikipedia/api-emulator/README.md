# @api-emulator/wikipedia

Wikipedia provides Wikimedia REST and MediaWiki Action API read surfaces for page summaries, search, extracts, and content retrieval.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/wikipedia
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@wikipedia/api-emulator.mjs --service wikipedia
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/rest_v1/page/summary/:title{.+}`
- `GET /w/rest.php/v1/search/page`
- `GET /w/rest.php/v1/search/title`
- `GET /w/rest.php/v1/page/:title/bare`
- `GET /w/rest.php/v1/page/:title/html`
- `GET /w/rest.php/v1/page/:title`
- `GET /w/api.php`
- `GET /wikipedia/inspect/state`
- `GET /wikipedia/inspect/contract`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
wikipedia:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.mediawiki.org/wiki/Wikimedia_REST_API)
- [api-emulator](https://github.com/jsj/api-emulator)
