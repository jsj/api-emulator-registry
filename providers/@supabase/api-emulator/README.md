# @api-emulator/supabase

Supabase provides backend APIs for Postgres projects, auth, storage, edge functions, and database workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/supabase
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@supabase/api-emulator.mjs --service supabase
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface without smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
supabase:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
