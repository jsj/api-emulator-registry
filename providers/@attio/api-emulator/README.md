# @api-emulator/attio

Attio provides CRM APIs for workspace identity, objects, attributes, records, searches, and lists.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/attio
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@attio/api-emulator.mjs --service attio
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
attio:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.attio.com/rest-api/overview)
- [api-emulator](https://github.com/jsj/api-emulator)
