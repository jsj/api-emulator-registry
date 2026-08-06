# @api-emulator/snowflake

Snowflake provides SQL API statement execution and REST resources for databases, schemas, warehouses, and users.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/snowflake
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@snowflake/api-emulator.mjs --service snowflake
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /api/v2/statements`
- `GET /api/v2/statements/:statementHandle`
- `POST /api/v2/statements/:statementHandle/cancel`
- `GET /api/v2/databases`
- `GET /api/v2/databases/:databaseName/schemas`
- `GET /api/v2/warehouses`
- `GET /api/v2/users`
- `GET /api/v2/tables`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
snowflake:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.snowflake.com/en/developer-guide/sql-api/index)
- [api-emulator](https://github.com/jsj/api-emulator)
