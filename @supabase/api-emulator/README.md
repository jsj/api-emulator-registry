# @api-emulator/supabase

Supabase provides backend APIs for Postgres projects, auth, storage, edge functions, and database workflows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/supabase
```

## Run

```bash
npx -p api-emulator api --plugin ./@supabase/api-emulator.mjs --service supabase
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface without smoke coverage

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
supabase:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
