# @api-emulator/gusto

Gusto provides payroll and HR APIs for companies, employees, contractors, payrolls, benefits, and onboarding.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/gusto
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@gusto/api-emulator.mjs --service gusto
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/me`
- `GET /v1/companies/:companyId/employees`
- `POST /v1/companies/:companyId/employees`
- `GET /v1/companies/:companyId/payrolls`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
gusto:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.gusto.com/app-integrations/reference)
- [api-emulator](https://github.com/jsj/api-emulator)
