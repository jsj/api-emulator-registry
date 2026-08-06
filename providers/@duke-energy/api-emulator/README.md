# @api-emulator/duke-energy

Duke Energy customer APIs provide Auth0 token exchange, account lists, account details, balances, meters, and usage graph workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/duke-energy
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@duke-energy/api-emulator.mjs --service duke-energy
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /login/auth-token`
- `GET /account-list`
- `GET /account-details-v2`
- `POST /account/usage/graph`
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
duke-energy:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/hunterjm/aiodukeenergy)
- [api-emulator](https://github.com/jsj/api-emulator)
