# @api-emulator/bilt

Bilt Rewards-style APIs provide member profiles, rewards accounts, points ledger, and rent payment workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/bilt
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@bilt/api-emulator.mjs --service bilt
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/member`
- `GET /v1/rewards/accounts`
- `GET /v1/rewards/ledger`
- `GET /v1/rent-payments`
- `POST /v1/rent-payments`
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
bilt:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.bilt.com/rewards)
- [api-emulator](https://github.com/jsj/api-emulator)
