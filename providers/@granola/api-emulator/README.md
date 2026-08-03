# @api-emulator/granola

Granola provides programmatic access to meeting notes, transcripts, participants, and summaries.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/granola
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@granola/api-emulator.mjs --service granola
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
granola:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.granola.ai/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
