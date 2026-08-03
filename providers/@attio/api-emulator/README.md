# @api-emulator/attio

Attio provides CRM APIs for workspace identity, objects, attributes, records, searches, and lists.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/attio
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@attio/api-emulator.mjs --service attio
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v2/self`
- `GET /v2/objects`
- `GET /v2/objects/:object`
- `GET /v2/objects/:object/attributes`
- `POST /v2/objects/:object/records/query`
- `GET /v2/objects/:object/records/:recordId`
- `POST /v2/objects/:object/records`
- `PATCH /v2/objects/:object/records/:recordId`
- `GET /v2/lists`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
attio:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.attio.com/rest-api/overview)
- [api-emulator](https://github.com/jsj/api-emulator)
