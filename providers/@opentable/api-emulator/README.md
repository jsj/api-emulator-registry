# @api-emulator/opentable

OpenTable provides OAuth and Consumer API v2 booking APIs for availability, slot locks, reservations, modification, and cancellation.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/opentable
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@opentable/api-emulator.mjs --service opentable
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

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

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
opentable:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.opentable.com)
- [api-emulator](https://github.com/jsj/api-emulator)
