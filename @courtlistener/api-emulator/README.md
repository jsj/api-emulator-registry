# @api-emulator/courtlistener

CourtListener provides legal search, docket, and RECAP document APIs for court and litigation research workflows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/courtlistener
```

## Run

```bash
npx -p api-emulator api --plugin ./@courtlistener/api-emulator.mjs --service courtlistener
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET /inspect/contract`
- `GET /api/rest/v4/search/`
- `GET /api/rest/v4/dockets/:docketId/`
- `GET /api/rest/v4/recap-documents/:recapDocumentId/`

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
courtlistener:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.courtlistener.com/help/api/rest/)
- [api-emulator](https://github.com/jsj/api-emulator)
