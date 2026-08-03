# @api-emulator/hashicorp-vault

HashiCorp Vault provides secrets-management APIs for health checks, mounts, and KV v2 secret read/write/list workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/hashicorp-vault
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@hashicorp-vault/api-emulator.mjs --service hashicorp-vault
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/sys/seal-status`
- `GET /v1/sys/health`
- `GET /v1/sys/mounts`
- `POST /v1/sys/mounts/:path`
- `GET /v1/sys/internal/ui/mounts/:path{.+}`
- `POST /v1/:mount/data/:path{.+}`
- `GET /v1/:mount/data/:path{.+}`
- `GET /v1/:mount/metadata/:path{.+}`
- `GET /v1/:mount/metadata`
- `GET /hashicorp-vault/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
hashicorp-vault:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.hashicorp.com/vault/api-docs)
- [api-emulator](https://github.com/jsj/api-emulator)
