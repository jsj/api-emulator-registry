# @api-emulator/concur

SAP Concur provides travel and expense APIs for users, expense reports, entries, receipts, and travel requests.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/concur
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@concur/api-emulator.mjs --service concur
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /oauth2/v0/userinfo`
- `POST /api/v3.0/expense/reports`
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
concur:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.concur.com/api-reference/)
- [api-emulator](https://github.com/jsj/api-emulator)
