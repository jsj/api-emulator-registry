# @api-emulator/mobbin

Mobbin provides MCP and Screens Search APIs for discovering mobile and web design reference screens.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/mobbin
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@mobbin/api-emulator.mjs --service mobbin
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /.well-known/oauth-protected-resource/mcp`
- `POST /v1/screens/search`
- `POST /mcp`
- `GET /mobbin/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
mobbin:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.mobbin.com/mcp)
- [api-emulator](https://github.com/jsj/api-emulator)
