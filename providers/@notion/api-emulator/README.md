# @api-emulator/notion

Notion provides a local API emulator.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/notion
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@notion/api-emulator/src/index.ts --service notion
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/users`
- `GET /v1/users/me`
- `GET /v1/users/:user_id`
- `POST /v1/search`
- `POST /v1/pages`
- `GET /v1/pages/:page_id`
- `PATCH /v1/pages/:page_id`
- `GET /v1/pages/:page_id/properties/:property_id`
- `POST /v1/databases`
- `GET /v1/databases/:database_id`
- `PATCH /v1/databases/:database_id`
- `POST /v1/databases/:database_id/query`
- `GET /v1/data_sources/:data_source_id`
- `POST /v1/data_sources/:data_source_id/query`
- `GET /v1/pages/:page_id/markdown`
- `PATCH /v1/pages/:page_id/markdown`
- `GET /v1/blocks/:block_id`
- `PATCH /v1/blocks/:block_id`
- `DELETE /v1/blocks/:block_id`
- `GET /v1/blocks/:block_id/children`
- `PATCH /v1/blocks/:block_id/children`
- `GET /v1/comments`
- `POST /v1/comments`
- `POST /api/v3/workersListWorkers`
- `POST /api/v3/workersCreateWorker`
- `POST /api/v3/workersGetWorker`
- `POST /api/v3/workersDeleteWorker`
- `POST /api/v3/workersListCapabilities`
- `POST /api/v3/workersListRuns`
- `POST /api/v3/workersListRunsForWorker`
- `POST /api/v3/workersGetRunLogs`

## Coverage

- Level: `generated fallback`
- Meaning: This emulator has a generated API without direct coverage tests.
- Evidence: a local generated API exists, but smoke and conformance evidence does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
notion:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
