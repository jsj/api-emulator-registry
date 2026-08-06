# @api-emulator/pinterest

Pinterest REST API v5 provides user account, board, and pin creation/listing workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/pinterest
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@pinterest/api-emulator.mjs --service pinterest
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v5/user_account`
- `GET /v5/boards`
- `POST /v5/boards`
- `GET /v5/boards/:id`
- `PATCH /v5/boards/:id`
- `DELETE /v5/boards/:id`
- `GET /v5/boards/:id/pins`
- `GET /v5/pins`
- `POST /v5/pins`
- `GET /v5/pins/:id`
- `PATCH /v5/pins/:id`
- `DELETE /v5/pins/:id`
- `GET /v5/ad_accounts`
- `GET /v5/catalogs`
- `GET /pinterest/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
pinterest:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.pinterest.com/docs/api/v5/)
- [api-emulator](https://github.com/jsj/api-emulator)
