# @api-emulator/x-ads

X Ads MCP provides campaign, line-item, targeting, creative, account, and analytics tools.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/x-ads
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@x-ads/api-emulator.mjs --service x-ads
```

## Endpoints

- `POST /mcp` — Streamable HTTP MCP initialize, tools/list, and tools/call.
- `GET /inspect/state` — inspect deterministic campaigns and related state.

## Auth

The emulator accepts synthetic local bearer-token configuration. It never contacts X. Production uses OAuth2 scopes `ads.read`, `ads.write`, and `offline.access`.

Campaign and line-item creation always starts `PAUSED`, matching the production safety contract. Activation requires the explicit activation tools.

## Links

- [Official X Ads MCP documentation](https://docs.x.com/x-ads-api/mcp)
- [api-emulator](https://github.com/jsj/api-emulator)
