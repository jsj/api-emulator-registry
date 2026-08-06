# @api-emulator/servicenow

ServiceNow provides customer-support and ITSM APIs for Table API incidents, users, groups, and workflow records.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/servicenow
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@servicenow/api-emulator.mjs --service servicenow
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/now/table/:table`
- `POST /api/now/table/:table`
- `GET /api/now/table/:table/:sysId`
- `PATCH /api/now/table/:table/:sysId`
- `PUT /api/now/table/:table/:sysId`
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
servicenow:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)
- [api-emulator](https://github.com/jsj/api-emulator)
