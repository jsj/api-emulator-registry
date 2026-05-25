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

## Endpoints

- `GET /v1/users` — returns the authenticated user profile.
- `GET /v1/owners` — lists user and team workspaces with cursor wrappers.
- `GET /v1/services` — lists services, optionally scoped by `ownerId`.
- `POST /v1/services` — creates a deterministic local service.
- `GET /v1/services/:serviceId` — retrieves a service.
- `POST /v1/blueprints/validate` — returns a successful blueprint validation result.
- `GET /render/inspect/state` — returns emulator state for smoke assertions.

## Auth

Accepts any fake `Authorization: Bearer <token>` header. Cursor pagination uses Render-style wrapper objects with a per-item `cursor`.

## Seed Configuration

```yaml
render:
  user:
    email: ada@example.com
    name: Ada Lovelace
  owners:
    - id: tea-emulator
      name: Emulator Team
      type: team
  services:
    - id: srv-emulator-web
      name: emulator-web
      type: web_service
      ownerId: tea-emulator
```

## Links

- [Official API docs](https://render.com/docs/api)
- [OpenAPI spec](https://api-docs.render.com/docs/api-spec)
- [Render CLI](https://render.com/docs/cli)
- [api-emulator](https://github.com/jsj/api-emulator)
