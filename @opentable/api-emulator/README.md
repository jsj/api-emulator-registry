# @api-emulator/opentable

Local deterministic emulator for OpenTable OAuth and Consumer API v2 booking flows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/opentable
```

## Run

```bash
npx -p api-emulator api --plugin ./@opentable/api-emulator.mjs --service opentable
```

## Endpoints

- `GET /api/v2/oauth/token` — issue deterministic OAuth client-credentials tokens.
- `GET /v2/availability/:rid` — return bookable times and dining areas for one restaurant.
- `GET /v2/availability-metadata/:rid` — return environments, attributes, and dining-area metadata.
- `POST /v2/booking/:rid/slot_locks` — reserve a temporary slot lock.
- `DELETE /v2/booking/:rid/slot_locks/:reservation_token` — release a slot lock.
- `POST /v2/booking/:rid/reservations` — create a confirmed reservation from a slot lock.
- `GET /v2/booking/:rid/reservations/:rid-:confirmation_id` — retrieve reservation details.
- `PUT /v2/booking/:rid/reservations/:rid-:confirmation_id` — modify or cancel a reservation.

## Auth

Protected endpoints accept `Authorization: Bearer opentable_emulator_token` or an access token returned by `/api/v2/oauth/token`. Missing tokens are accepted for local compatibility; unknown bearer tokens return OpenTable-shaped `invalid_token` errors.

## Seed Configuration

```yaml
opentable:
  acceptedTokens:
    - opentable_emulator_token
  restaurants:
    1074796:
      rid: 1074796
      name: Sandbox Trattoria
```

## Links

- [Official API docs](https://docs.opentable.com)
- [api-emulator](https://github.com/jsj/api-emulator)
