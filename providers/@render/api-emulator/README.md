# @api-emulator/render

Render provides hosting control-plane APIs for users, workspaces, services, and blueprint validation.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/render
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@render/api-emulator.mjs --service render
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET ${prefix}/users`
- `GET ${prefix}/owners`
- `GET ${prefix}/services`
- `POST ${prefix}/services`
- `GET ${prefix}/services/:serviceId`
- `POST ${prefix}/blueprints/validate`
- `GET /render/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
render:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api-docs.render.com/docs/api-spec)
- [api-emulator](https://github.com/jsj/api-emulator)
