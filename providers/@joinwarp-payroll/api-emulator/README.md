# @api-emulator/joinwarp-payroll

JoinWarp Payroll provides workforce APIs for departments, workplaces, workers, invitations, and time-off records.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/joinwarp-payroll
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@joinwarp-payroll/api-emulator.mjs --service joinwarp-payroll
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

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

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
joinwarp-payroll:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.warp.co/api)
- [api-emulator](https://github.com/jsj/api-emulator)
