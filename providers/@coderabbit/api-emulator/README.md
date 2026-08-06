# @api-emulator/coderabbit

CodeRabbit provides code-review automation APIs for users, seats, roles, review metrics, and audit logs.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/coderabbit
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@coderabbit/api-emulator.mjs --service coderabbit
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/users`
- `POST /v1/users/seats`
- `POST /v1/users/roles`
- `GET /v1/metrics/reviews`
- `GET /v1/audit-logs`
- `GET /coderabbit/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
coderabbit:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.coderabbit.ai/api-reference)
- [api-emulator](https://github.com/jsj/api-emulator)
