# @api-emulator/opentable

OpenTable provides OAuth and Consumer API v2 booking APIs for availability, slot locks, reservations, modification, and cancellation.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/opentable
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@opentable/api-emulator.mjs --service opentable
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET ${prefix}/v2/availability/:rid`
- `GET ${prefix}/v2/availability-metadata/:rid`
- `POST ${prefix}/v2/booking/:rid/slot_locks`
- `DELETE ${prefix}/v2/booking/:rid/slot_locks/:reservationToken`
- `POST ${prefix}/v2/booking/:rid/reservations`
- `GET ${prefix}/v2/booking/:rid/reservations/:id`
- `PUT ${prefix}/v2/booking/:rid/reservations/:id`
- `GET /api/v2/oauth/token`
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
opentable:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.opentable.com)
- [api-emulator](https://github.com/jsj/api-emulator)
