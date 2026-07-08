# @api-emulator/opentable

OpenTable provides OAuth and Consumer API v2 booking APIs for availability, slot locks, reservations, modification, and cancellation.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/opentable
```

## Run

```bash
npx -p api-emulator api --plugin ./@opentable/api-emulator.mjs --service opentable
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

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

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
opentable:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.opentable.com)
- [api-emulator](https://github.com/jsj/api-emulator)
