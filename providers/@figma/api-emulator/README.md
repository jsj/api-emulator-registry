# @api-emulator/figma

Figma provides REST APIs for user identity, design files, image rendering, comments, teams, and collaboration workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/figma
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@figma/api-emulator.mjs --service figma
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/me`
- `GET /v1/files/:key`
- `GET /v1/images/:key`
- `GET /v1/files/:key/comments`
- `POST /v1/files/:key/comments`
- `GET /figma/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
figma:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.figma.com/docs/rest-api/)
- [api-emulator](https://github.com/jsj/api-emulator)
