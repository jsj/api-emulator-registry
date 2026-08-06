# @api-emulator/ramp

Ramp provides finance APIs for entities, users, corporate cards, transactions, reimbursements, bills, and spend controls.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/ramp
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@ramp/api-emulator.mjs --service ramp
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /developer/v1/reimbursements`
- `POST /developer/v1/agent-tools/get-simplified-user-detail`
- `POST /developer/v1/agent-tools/list-users`
- `POST /developer/v1/agent-tools/get-transactions`
- `POST /developer/v1/agent-tools/get-full-transaction-metadata`
- `POST /developer/v1/agent-tools/get-reimbursements`
- `GET /v1/public/agent-tools/spec/hash`
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
ramp:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.ramp.com/developer-api/v1/overview)
- [api-emulator](https://github.com/jsj/api-emulator)
