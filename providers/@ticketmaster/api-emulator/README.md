# @api-emulator/ticketmaster

Ticketmaster Discovery API v2 provides event, attraction, venue, classification, image, and suggest search APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/ticketmaster
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@ticketmaster/api-emulator.mjs --service ticketmaster
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

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

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
ticketmaster:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)
- [api-emulator](https://github.com/jsj/api-emulator)
