# @api-emulator/wikipedia

Wikipedia provides Wikimedia REST and MediaWiki Action API read surfaces for page summaries, search, extracts, and content retrieval.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/wikipedia
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@wikipedia/api-emulator.mjs --service wikipedia
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /api/rest_v1/page/summary/:title{.+}`
- `GET /w/rest.php/v1/search/page`
- `GET /w/rest.php/v1/search/title`
- `GET /w/rest.php/v1/page/:title/bare`
- `GET /w/rest.php/v1/page/:title/html`
- `GET /w/rest.php/v1/page/:title`
- `GET /w/api.php`
- `GET /wikipedia/inspect/state`
- `GET /wikipedia/inspect/contract`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
wikipedia:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.mediawiki.org/wiki/Wikimedia_REST_API)
- [api-emulator](https://github.com/jsj/api-emulator)
