# @api-emulator/digitalocean

DigitalOcean provides cloud infrastructure APIs for accounts, projects, droplets, networking, and managed resources.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/digitalocean
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@digitalocean/api-emulator.mjs --service digitalocean
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v2/account`
- `GET /v2/projects`
- `POST /v2/projects`
- `GET /v2/projects/:projectId`
- `GET /v2/droplets`
- `GET /v2/droplets/:dropletId`
- `GET /digitalocean/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
digitalocean:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.digitalocean.com/reference/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
