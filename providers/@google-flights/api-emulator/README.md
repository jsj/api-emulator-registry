# @api-emulator/google-flights

Google Flights-style APIs provide deterministic airport search, flight offer search, and price insight responses for travel workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/google-flights
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@google-flights/api-emulator.mjs --service google-flights
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface with smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
google-flights:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.google.com/travel/flights)
- [api-emulator](https://github.com/jsj/api-emulator)
