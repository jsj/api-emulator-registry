# @api-emulator/ticketmaster

Ticketmaster Discovery API v2 provides event, attraction, venue, classification, image, and suggest search APIs.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/ticketmaster
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@ticketmaster/api-emulator.mjs --service ticketmaster
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
ticketmaster:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)
- [api-emulator](https://github.com/jsj/api-emulator)
