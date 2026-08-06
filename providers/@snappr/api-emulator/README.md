# @api-emulator/snappr

Snappr provides visual-content APIs for coverage, availability, photoshoot bookings, editing jobs, presets, and asset retrieval.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/snappr
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@snappr/api-emulator.mjs --service snappr
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /coverage`
- `GET /availability`
- `POST /bookings`
- `GET /bookings`
- `GET /bookings/:bookingUid`
- `GET /bookings/:bookingUid/images`
- `GET /bookings/:bookingUid/videos`
- `POST /editing-jobs`
- `GET /editing-jobs`
- `GET /editing-jobs/:editingJobUid`
- `GET /editing-jobs/:editingJobUid/images`
- `GET /presets`
- `GET /shoottypes`
- `GET /editing-job-types`
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
snappr:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.snappr.com/#introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
