# @api-emulator/spectrum

Spectrum Enterprise ticketing APIs provide OAuth tokens, sites, circuits, tickets, notes, and attachments for B2B support workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/spectrum
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@spectrum/api-emulator.mjs --service spectrum
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /auth/oauth/v2/token`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
spectrum:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://apis.spectrum.net/entservices/ticketing-b2b/v1)
- [api-emulator](https://github.com/jsj/api-emulator)
