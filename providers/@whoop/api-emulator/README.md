# @api-emulator/whoop

WHOOP provides health APIs for athlete profiles, body measurements, cycles, recovery, sleep, and workouts.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/whoop
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@whoop/api-emulator.mjs --service whoop
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /oauth/oauth2/token`
- `GET /developer/v2/user/profile/basic`
- `GET /developer/v2/user/measurement/body`
- `GET /developer/v2/cycle`
- `GET /developer/v2/recovery`
- `GET /developer/v2/activity/sleep`
- `GET /developer/v2/activity/workout`
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
whoop:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.whoop.com/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
