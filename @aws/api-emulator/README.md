# @api-emulator/aws

AWS provides cloud infrastructure APIs for storage, queues, identity, compute, and managed services.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/aws
```

## Run

```bash
npx -p api-emulator api --plugin ./@aws/api-emulator/src/index.ts --service aws
```

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
aws:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
