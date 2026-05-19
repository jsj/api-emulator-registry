# @api-emulator/snowflake

Snowflake emulator for SQL API statements and core Snowflake REST resource listing.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/snowflake
```

## Run

```bash
npx -p api-emulator api --plugin ./@snowflake/api-emulator.mjs --service snowflake
```

## Endpoints

- `POST /api/v2/statements` — executes a deterministic SQL API statement
- `GET /api/v2/statements/:statementHandle` — fetches statement results
- `POST /api/v2/statements/:statementHandle/cancel` — marks a statement as canceled
- `GET /api/v2/databases` — lists databases
- `GET /api/v2/databases/:databaseName/schemas` — lists schemas
- `GET /api/v2/warehouses` — lists warehouses
- `GET /api/v2/users` — lists users

## Auth

Use fake bearer or key-pair JWT tokens. The emulator accepts headers shaped like Snowflake clients send, including `Authorization` and `X-Snowflake-Authorization-Token-Type`, without validating real credentials.

## Seed Configuration

```yaml
snowflake:
  databases:
    - name: EMULATOR_DB
  warehouses:
    - name: COMPUTE_WH
      state: STARTED
```

## Links

- [Snowflake SQL API](https://docs.snowflake.com/en/developer-guide/sql-api/index)
- [Snowflake REST APIs](https://docs.snowflake.com/en/developer-guide/snowflake-rest-api/snowflake-rest-api)
- [api-emulator](https://github.com/jsj/api-emulator)
