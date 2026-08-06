# @api-emulator/courtlistener

CourtListener provides legal search, docket, and RECAP document APIs for court and litigation research workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/courtlistener
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@courtlistener/api-emulator.mjs --service courtlistener
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /inspect/contract`
- `GET /api/rest/v4/search/`
- `GET /api/rest/v4/dockets/:docketId/`
- `GET /api/rest/v4/recap-documents/:recapDocumentId/`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
courtlistener:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.courtlistener.com/help/api/rest/)
- [api-emulator](https://github.com/jsj/api-emulator)
