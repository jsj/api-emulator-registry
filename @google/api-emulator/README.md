# @api-emulator/google

Google provides OAuth and Workspace APIs for Gmail, Drive, Calendar, Docs, Sheets, and admin workflows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/google
```

## Run

```bash
npx -p api-emulator api --plugin ./@google/api-emulator/src/index.ts --service google
```

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
google:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.google.com/workspace)
- [api-emulator](https://github.com/jsj/api-emulator)
