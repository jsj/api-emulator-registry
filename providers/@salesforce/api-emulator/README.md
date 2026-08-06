# @api-emulator/salesforce

Salesforce provides CRM APIs for org identity, SOQL queries, object metadata, and sObject record workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/salesforce
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@salesforce/api-emulator.mjs --service salesforce
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
salesforce:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_rest.htm)
- [api-emulator](https://github.com/jsj/api-emulator)
