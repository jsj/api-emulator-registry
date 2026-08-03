# @api-emulator/servicenow

ServiceNow provides customer-support and ITSM APIs for Table API incidents, users, groups, and workflow records.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/servicenow
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@servicenow/api-emulator.mjs --service servicenow
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /api/now/table/:table`
- `POST /api/now/table/:table`
- `GET /api/now/table/:table/:sysId`
- `PATCH /api/now/table/:table/:sysId`
- `PUT /api/now/table/:table/:sysId`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
servicenow:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)
- [api-emulator](https://github.com/jsj/api-emulator)
