# @api-emulator/brex

Brex provides spend-management APIs for vendors, users, payments, and team workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/brex
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@brex/api-emulator.mjs --service brex
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/vendors`
- `POST /v1/vendors`
- `GET /v1/vendors/:vendorId`
- `PUT /v1/vendors/:vendorId`
- `DELETE /v1/vendors/:vendorId`
- `GET /v2/users/me`
- `GET /v2/users`
- `GET /v2/users/:userId`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
brex:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.brex.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
