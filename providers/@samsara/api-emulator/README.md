# @api-emulator/samsara

Samsara provides connected operations APIs for fleets, vehicles, drivers, routes, sensors, safety, and telematics.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/samsara
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@samsara/api-emulator.mjs --service samsara
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /fleet/routes`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
samsara:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.samsara.com/reference/overview)
- [api-emulator](https://github.com/jsj/api-emulator)
