# @api-emulator/google

Google provides OAuth and Workspace APIs for Gmail, Drive, Calendar, Docs, Sheets, and admin workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/google
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@google/api-emulator/src/index.ts --service google
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface with smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
google:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.google.com/workspace)
- [api-emulator](https://github.com/jsj/api-emulator)
