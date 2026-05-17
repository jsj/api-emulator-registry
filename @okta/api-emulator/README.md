# @api-emulator/okta

Okta provides identity APIs for OAuth, users, groups, apps, sessions, and identity providers.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/okta
```

## Run

```bash
npx -p api-emulator api --plugin ./@okta/api-emulator/src/index.ts --service okta
```

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
okta:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
