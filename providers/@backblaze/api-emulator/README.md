# @api-emulator/backblaze

Backblaze B2 provides cloud storage APIs for account authorization, bucket management, and object storage workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/backblaze
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@backblaze/api-emulator.mjs --service backblaze
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /b2api/v4/b2_authorize_account`
- `GET /b2api/v3/b2_authorize_account`
- `POST /b2api/v4/b2_list_buckets`
- `POST /b2api/v4/b2_create_bucket`
- `POST /b2api/v4/b2_delete_bucket`
- `GET /backblaze/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
backblaze:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.backblaze.com/apidocs/introduction-to-the-b2-native-api)
- [api-emulator](https://github.com/jsj/api-emulator)
