# @api-emulator/pinterest

Pinterest REST API v5 provides user account, board, and pin creation/listing workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/pinterest
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@pinterest/api-emulator.mjs --service pinterest
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

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

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
pinterest:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.pinterest.com/docs/api/v5/)
- [api-emulator](https://github.com/jsj/api-emulator)
