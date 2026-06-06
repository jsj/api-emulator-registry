# @api-emulator/ticketmaster

Local deterministic emulator for Ticketmaster Discovery API v2 event, attraction, venue, classification, and suggest workflows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/ticketmaster
```

## Run

```bash
npx -p api-emulator api --plugin ./@ticketmaster/api-emulator.mjs --service ticketmaster
```

## Endpoints

- `GET /discovery/v2/events.json` — search events with Ticketmaster-style HAL pagination.
- `GET /discovery/v2/events/:id.json` — retrieve event details with embedded venue and attraction data.
- `GET /discovery/v2/events/:id/images.json` — retrieve event images.
- `GET /discovery/v2/venues.json` — search venues.
- `GET /discovery/v2/venues/:id.json` — retrieve venue details.
- `GET /discovery/v2/attractions.json` — search attractions.
- `GET /discovery/v2/attractions/:id.json` — retrieve attraction details.
- `GET /discovery/v2/classifications.json` — list music and sports classifications.
- `GET /discovery/v2/suggest.json` — return matching event, attraction, and venue suggestions.

## Auth

Pass `apikey=ticketmaster-emulator-key`, `test-key`, or `demo-key` as a query parameter. Missing or unknown keys return the official Ticketmaster `Invalid ApiKey` fault shape.

## Seed Configuration

```yaml
ticketmaster:
  acceptedApiKeys:
    - ticketmaster-emulator-key
  events:
    custom_event_id:
      name: Custom Event
```

## Links

- [Official API docs](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)
- [api-emulator](https://github.com/jsj/api-emulator)
