# @api-emulator/suno

SunoAPI-compatible APIs provide credits, asynchronous music generation tasks, record polling, and lyrics generation workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/suno
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@suno/api-emulator.mjs --service suno
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/v1/generate/credit`
- `POST /api/v1/generate`
- `GET /api/v1/generate/record-info`
- `POST /api/v1/generate/extend`
- `POST /api/v1/wav/generate`
- `POST /api/v1/mp4/generate`
- `POST /api/v1/lyrics`
- `GET /api/v1/lyrics/record-info`
- `GET /suno/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
suno:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.sunoapi.org/)
- [api-emulator](https://github.com/jsj/api-emulator)
