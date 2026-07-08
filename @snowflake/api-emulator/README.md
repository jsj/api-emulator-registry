# @api-emulator/snowflake

Snowflake provides SQL API statement execution and REST resources for databases, schemas, warehouses, and users.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/snowflake
```

## Run

```bash
npx -p api-emulator api --plugin ./@snowflake/api-emulator.mjs --service snowflake
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

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

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
snowflake:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.snowflake.com/en/developer-guide/sql-api/index)
- [api-emulator](https://github.com/jsj/api-emulator)
