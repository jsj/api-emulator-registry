# @api-emulator/adp

ADP provides Human Capital Management APIs for workers, payroll events, organizations, time, and pay data.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/adp
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@adp/api-emulator.mjs --service adp
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /hr/v2/workers`
- `GET /hr/v2/workers/:associateOid`
- `POST /events/hr/v1/worker.hire`
- `POST /payroll/v1/pay-data-input`
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
adp:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.adp.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
