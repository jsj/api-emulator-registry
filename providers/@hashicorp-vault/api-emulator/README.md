# @api-emulator/hashicorp-vault

HashiCorp Vault provides secrets-management APIs for health checks, mounts, and KV v2 secret read/write/list workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/hashicorp-vault
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@hashicorp-vault/api-emulator.mjs --service hashicorp-vault
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
hashicorp-vault:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.hashicorp.com/vault/api-docs)
- [api-emulator](https://github.com/jsj/api-emulator)
