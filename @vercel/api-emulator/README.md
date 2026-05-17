# @api-emulator/vercel

Vercel provides deployment platform APIs for projects, builds, domains, environment variables, teams, and accounts.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/vercel
```

## Run

```bash
npx -p api-emulator api --plugin ./@vercel/api-emulator/src/index.ts --service vercel
```

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
vercel:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
