# @api-emulator/snowflake

Snowflake provides SQL API statement execution and REST resources for databases, schemas, warehouses, and users.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/snowflake
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@snowflake/api-emulator.mjs --service snowflake
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

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

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
snowflake:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.snowflake.com/en/developer-guide/sql-api/index)
- [api-emulator](https://github.com/jsj/api-emulator)
