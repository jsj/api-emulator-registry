# @api-emulator/siriusxm

SiriusXM provides channel lineup, now-playing metadata, recent track, profile, and favorite channel workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/siriusxm
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@siriusxm/api-emulator.mjs --service siriusxm
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/me`
- `GET /v1/channels`
- `GET /v1/channels/:id`
- `GET /v1/channels/:id/now-playing`
- `GET /v1/channels/:id/tracks`
- `GET /v1/me/favorites/channels`
- `PUT /v1/me/favorites/channels/:id`
- `DELETE /v1/me/favorites/channels/:id`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
siriusxm:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.siriusxm.com/channels and https://xmplaylist.com/docs)
- [api-emulator](https://github.com/jsj/api-emulator)
