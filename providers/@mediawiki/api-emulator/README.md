# @api-emulator/mediawiki

MediaWiki provides Action API and page summary APIs for Wikipedia, Wikimedia Commons, Wiktionary, Wikidata, and Fandom-style wiki workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/mediawiki
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@mediawiki/api-emulator.mjs --service mediawiki
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /api.php`
- `POST /api.php`
- `GET /w/api.php`
- `POST /w/api.php`
- `GET /api/rest_v1/page/summary/:title`
- `GET /w/rest.php/v1/page/:title/summary`
- `GET /mediawiki/inspect/contract`
- `GET /mediawiki/inspect/state`
- `GET /mediawiki/inspect/popular`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
mediawiki:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.mediawiki.org/wiki/API:Action_API)
- [api-emulator](https://github.com/jsj/api-emulator)
