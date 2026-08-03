# @api-emulator/backblaze

Backblaze B2 provides cloud storage APIs for account authorization, bucket management, and object storage workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/backblaze
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@backblaze/api-emulator.mjs --service backblaze
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /b2api/v4/b2_authorize_account`
- `GET /b2api/v3/b2_authorize_account`
- `POST /b2api/v4/b2_list_buckets`
- `POST /b2api/v4/b2_create_bucket`
- `POST /b2api/v4/b2_delete_bucket`
- `GET /backblaze/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
backblaze:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.backblaze.com/apidocs/introduction-to-the-b2-native-api)
- [api-emulator](https://github.com/jsj/api-emulator)
