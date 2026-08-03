# @api-emulator/courtlistener

CourtListener provides legal search, docket, and RECAP document APIs for court and litigation research workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/courtlistener
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@courtlistener/api-emulator.mjs --service courtlistener
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /inspect/contract`
- `GET /api/rest/v4/search/`
- `GET /api/rest/v4/dockets/:docketId/`
- `GET /api/rest/v4/recap-documents/:recapDocumentId/`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
courtlistener:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.courtlistener.com/help/api/rest/)
- [api-emulator](https://github.com/jsj/api-emulator)
