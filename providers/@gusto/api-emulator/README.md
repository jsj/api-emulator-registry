# @api-emulator/gusto

Gusto provides payroll and HR APIs for companies, employees, contractors, payrolls, benefits, and onboarding.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/gusto
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@gusto/api-emulator.mjs --service gusto
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/me`
- `GET /v1/companies/:companyId/employees`
- `POST /v1/companies/:companyId/employees`
- `GET /v1/companies/:companyId/payrolls`
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
gusto:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.gusto.com/app-integrations/reference)
- [api-emulator](https://github.com/jsj/api-emulator)
