# @api-emulator/alibaba-cloud

Alibaba Cloud provides ECS RPC APIs for regions, zones, VPCs, compute instances, and lifecycle actions.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/alibaba-cloud
```

## Run

```bash
npx -p api-emulator api --plugin ./@alibaba-cloud/api-emulator.mjs --service alibaba-cloud
```

## Endpoints

- `GET /`
- `POST /`
- `GET /ecs`
- `POST /ecs`
- `GET /alibaba-cloud/inspect/state`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
alibaba-cloud:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.alibabacloud.com/help/en/ecs/developer-reference/api-describeinstances)
- [api-emulator](https://github.com/jsj/api-emulator)
