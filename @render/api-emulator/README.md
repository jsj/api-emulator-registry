# @api-emulator/render

Render provides hosting control-plane APIs for users, workspaces, services, and blueprint validation.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/render
```

## Run

```bash
npx -p api-emulator api --plugin ./@render/api-emulator.mjs --service render
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET ${prefix}/users`
- `GET ${prefix}/owners`
- `GET ${prefix}/services`
- `POST ${prefix}/services`
- `GET ${prefix}/services/:serviceId`
- `POST ${prefix}/blueprints/validate`
- `GET /render/inspect/state`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
render:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api-docs.render.com/docs/api-spec)
- [api-emulator](https://github.com/jsj/api-emulator)
