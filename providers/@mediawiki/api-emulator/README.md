# @api-emulator/mediawiki

MediaWiki provides Action API and page summary APIs for Wikipedia, Wikimedia Commons, Wiktionary, Wikidata, and Fandom-style wiki workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/mediawiki
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@mediawiki/api-emulator.mjs --service mediawiki
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api.php`
- `POST /api.php`
- `GET /w/api.php`
- `POST /w/api.php`
- `GET /api/rest_v1/page/summary/:title`
- `GET /w/rest.php/v1/page/:title/summary`
- `GET /mediawiki/inspect/contract`
- `GET /mediawiki/inspect/state`
- `GET /mediawiki/inspect/popular`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
mediawiki:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.mediawiki.org/wiki/API:Action_API)
- [api-emulator](https://github.com/jsj/api-emulator)
