# @api-emulator/hubspot

HubSpot provides CRM and developer APIs for accounts, contacts, companies, deals, properties, CMS tables, files, and secrets.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/hubspot
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@hubspot/api-emulator.mjs --service hubspot
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /oauth/v1/access-tokens/:token`
- `GET /account-info/v3/details`
- `GET /crm/v3/objects/:objectType`
- `POST /crm/v3/objects/:objectType`
- `GET /crm/v3/objects/:objectType/:objectId`
- `PATCH /crm/v3/objects/:objectType/:objectId`
- `POST /crm/v3/objects/:objectType/search`
- `GET /crm/v3/properties/:objectType`
- `GET /crm/v3/properties/:objectType/:propertyName`
- `GET /cms/v3/hubdb/tables`
- `GET /files/v3/files/search`
- `GET /developer/v3/secrets`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
hubspot:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.hubspot.com/docs)
- [api-emulator](https://github.com/jsj/api-emulator)
