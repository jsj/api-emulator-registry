# @api-emulator/salesforce

Salesforce provides CRM APIs for org identity, SOQL queries, object metadata, and sObject record workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/salesforce
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@salesforce/api-emulator.mjs --service salesforce
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /services/oauth2/userinfo`
- `GET /services/data`
- `GET /services/data/:version`
- `GET /services/data/:version/limits`
- `GET /services/data/:version/query`
- `GET /services/data/:version/sobjects`
- `GET /services/data/:version/sobjects/:sobject/describe`
- `GET /services/data/:version/sobjects/:sobject/:id`
- `POST /services/data/:version/sobjects/:sobject`
- `PATCH /services/data/:version/sobjects/:sobject/:id`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
salesforce:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_rest.htm)
- [api-emulator](https://github.com/jsj/api-emulator)
