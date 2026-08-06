# @api-emulator/fidelity

Fidelity WorkplaceXchange provides workplace participant, retirement, stock-plan, HSA balance, and pay statement APIs.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/fidelity
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@fidelity/api-emulator.mjs --service fidelity
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /wpx/oauth2/token`
- `GET /wpx/hrp/v1/participants`
- `GET /wpx/hrp/v1/participants/:participantId`
- `GET /wpx/wi/v1/participants/:participantId/balances`
- `GET /wpx/hrp/v1/participants/:participantId/pay-statements`
- `POST /wpx/hrp/v1/participants`
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
fidelity:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://workplacexchange.fidelity.com/public/wpx/docs/wi-balances)
- [api-emulator](https://github.com/jsj/api-emulator)
