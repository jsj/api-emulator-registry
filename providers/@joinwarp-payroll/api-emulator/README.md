# @api-emulator/joinwarp-payroll

JoinWarp Payroll provides workforce APIs for departments, workplaces, workers, invitations, and time-off records.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/joinwarp-payroll
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@joinwarp-payroll/api-emulator.mjs --service joinwarp-payroll
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /v1/departments`
- `PATCH /v1/departments/:id`
- `POST /v1/workplaces`
- `PATCH /v1/workplaces/:id`
- `POST /v1/workers/employee`
- `POST /v1/workers/contractor`
- `POST /v1/workers/:id/invite`
- `DELETE /v1/workers/:id`
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
joinwarp-payroll:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.warp.co/api)
- [api-emulator](https://github.com/jsj/api-emulator)
