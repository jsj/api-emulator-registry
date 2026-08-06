# @api-emulator/rippling

Rippling provides workforce platform APIs for employees, groups, departments, devices, payroll, and identity data.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/rippling
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@rippling/api-emulator.mjs --service rippling
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /apps/api/integrations`
- `POST /apps/api/integrations/find_paginated`
- `GET /apps/api/apps/:id`
- `POST /platform/api/employees`
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
rippling:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.rippling.com/documentation/platform-api/)
- [api-emulator](https://github.com/jsj/api-emulator)
