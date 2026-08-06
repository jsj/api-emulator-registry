# @api-emulator/reducto

Reducto provides document parsing, extraction, splitting, upload, pipeline, webhook, and asynchronous job APIs.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/reducto
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@reducto/api-emulator.mjs --service reducto
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /version`
- `POST /upload`
- `POST /parse`
- `POST /parse_async`
- `POST /extract`
- `POST /extract_async`
- `POST /split`
- `POST /split_async`
- `POST /edit`
- `POST /edit_async`
- `POST /classify`
- `POST /pipeline`
- `POST /pipeline_async`
- `GET /job/:job_id`
- `GET /jobs`
- `POST /cancel/:job_id`
- `POST /configure_webhook`
- `GET /inspect/contract`
- `GET /inspect/state`
- `POST /inspect/reset`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
reducto:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.reducto.ai/sdk/python/overview)
- [api-emulator](https://github.com/jsj/api-emulator)
