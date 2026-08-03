# @api-emulator/alibaba-cloud

Alibaba Cloud provides ECS RPC APIs for regions, zones, VPCs, compute instances, and lifecycle actions.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/alibaba-cloud
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@alibaba-cloud/api-emulator.mjs --service alibaba-cloud
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /`
- `POST /`
- `GET /ecs`
- `POST /ecs`
- `GET /alibaba-cloud/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
alibaba-cloud:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.alibabacloud.com/help/en/ecs/developer-reference/api-describeinstances)
- [api-emulator](https://github.com/jsj/api-emulator)
