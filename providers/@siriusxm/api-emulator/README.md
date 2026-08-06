# @api-emulator/siriusxm

SiriusXM provides channel lineup, now-playing metadata, recent track, profile, and favorite channel workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/siriusxm
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@siriusxm/api-emulator.mjs --service siriusxm
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/me`
- `GET /v1/channels`
- `GET /v1/channels/:id`
- `GET /v1/channels/:id/now-playing`
- `GET /v1/channels/:id/tracks`
- `GET /v1/me/favorites/channels`
- `PUT /v1/me/favorites/channels/:id`
- `DELETE /v1/me/favorites/channels/:id`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
siriusxm:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.siriusxm.com/channels and https://xmplaylist.com/docs)
- [api-emulator](https://github.com/jsj/api-emulator)
