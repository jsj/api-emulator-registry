# @api-emulator/figma

Figma provides REST APIs for user identity, design files, image rendering, comments, teams, and collaboration workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/figma
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@figma/api-emulator.mjs --service figma
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/me`
- `GET /v1/files/:key`
- `GET /v1/images/:key`
- `GET /v1/files/:key/comments`
- `POST /v1/files/:key/comments`
- `GET /figma/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
figma:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.figma.com/docs/rest-api/)
- [api-emulator](https://github.com/jsj/api-emulator)
