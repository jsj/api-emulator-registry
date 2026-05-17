# @api-emulator/microsoft

Microsoft provides identity, tenant, user, and productivity APIs through Microsoft Graph-style surfaces.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/microsoft
```

## Run

```bash
npx -p api-emulator api --plugin ./@microsoft/api-emulator/src/index.ts --service microsoft
```

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
microsoft:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
