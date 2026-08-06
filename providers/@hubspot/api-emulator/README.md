# @api-emulator/hubspot

HubSpot provides CRM and developer APIs for accounts, contacts, companies, deals, properties, CMS tables, files, and secrets.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/hubspot
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@hubspot/api-emulator.mjs --service hubspot
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
hubspot:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.hubspot.com/docs)
- [api-emulator](https://github.com/jsj/api-emulator)
