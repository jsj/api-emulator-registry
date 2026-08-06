# @api-emulator/linode

Linode provides cloud APIs for instances, regions, VPCs, images, volumes, and node balancers.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/linode
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@linode/api-emulator.mjs --service linode
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

The emulator source lists the supported local API endpoints.

## Coverage

- Level: `stub`
- Meaning: This emulator has a small starter API.
- Evidence: starter surface with smoke coverage.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
linode:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://techdocs.akamai.com/linode-api/reference/api)
- [api-emulator](https://github.com/jsj/api-emulator)
