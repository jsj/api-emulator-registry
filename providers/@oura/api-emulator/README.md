# @api-emulator/oura

Oura Ring provides health APIs for personal info, daily sleep, readiness, activity, workouts, and heart-rate data.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/oura
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@oura/api-emulator.mjs --service oura
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v2/usercollection/personal_info`
- `GET /v2/usercollection/daily_sleep`
- `GET /v2/usercollection/sleep`
- `GET /v2/usercollection/daily_readiness`
- `GET /v2/usercollection/daily_activity`
- `GET /v2/usercollection/workout`
- `GET /v2/usercollection/heartrate`
- `GET /v2/sandbox/usercollection/daily_sleep`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
oura:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://cloud.ouraring.com/v2/docs)
- [api-emulator](https://github.com/jsj/api-emulator)
