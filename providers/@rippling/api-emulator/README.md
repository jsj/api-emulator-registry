# @api-emulator/rippling

Rippling provides workforce platform APIs for employees, groups, departments, devices, payroll, and identity data.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/rippling
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@rippling/api-emulator.mjs --service rippling
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /apps/api/integrations`
- `POST /apps/api/integrations/find_paginated`
- `GET /apps/api/apps/:id`
- `POST /platform/api/employees`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
rippling:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.rippling.com/documentation/platform-api/)
- [api-emulator](https://github.com/jsj/api-emulator)
