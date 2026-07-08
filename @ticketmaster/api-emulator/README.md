# @api-emulator/ticketmaster

Ticketmaster Discovery API v2 provides event, attraction, venue, classification, image, and suggest search APIs.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/ticketmaster
```

## Run

```bash
npx -p api-emulator api --plugin ./@ticketmaster/api-emulator.mjs --service ticketmaster
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET /discovery/v2/events${suffix}`
- `GET /discovery/v2/venues${suffix}`
- `GET /discovery/v2/attractions${suffix}`
- `GET /discovery/v2/classifications${suffix}`
- `GET /discovery/v2/suggest${suffix}`
- `GET /discovery/v2/events/:id/images${suffix}`
- `GET /discovery/v2/events/:id${suffix}`
- `GET /discovery/v2/venues/:id${suffix}`
- `GET /discovery/v2/attractions/:id${suffix}`
- `GET /inspect/contract`
- `GET /inspect/state`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
ticketmaster:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)
- [api-emulator](https://github.com/jsj/api-emulator)
