# @api-emulator/alibaba-cloud

Alibaba Cloud provides ECS RPC APIs for regions, zones, VPCs, compute instances, and lifecycle actions.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/alibaba-cloud
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@alibaba-cloud/api-emulator.mjs --service alibaba-cloud
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /`
- `POST /`
- `GET /ecs`
- `POST /ecs`
- `GET /alibaba-cloud/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
alibaba-cloud:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.alibabacloud.com/help/en/ecs/developer-reference/api-describeinstances)
- [api-emulator](https://github.com/jsj/api-emulator)
