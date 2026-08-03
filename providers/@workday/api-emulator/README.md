# @api-emulator/workday

Workday provides enterprise HR, finance, and planning APIs for workers, organizations, jobs, reports, and business processes.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/workday
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@workday/api-emulator.mjs --service workday
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /ccx/oauth2/:tenant/token`
- `GET /ccx/service/customreport2/:tenant/:reportOwner/:reportName`
- `POST /ccx/api/v1/:tenant/workers`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
workday:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://community.workday.com/rest-api)
- [api-emulator](https://github.com/jsj/api-emulator)
