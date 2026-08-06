# @api-emulator/render

Render provides hosting control-plane APIs for users, workspaces, services, and blueprint validation.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/render
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@render/api-emulator.mjs --service render
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET ${prefix}/users`
- `GET ${prefix}/owners`
- `GET ${prefix}/services`
- `POST ${prefix}/services`
- `GET ${prefix}/services/:serviceId`
- `POST ${prefix}/blueprints/validate`
- `GET /render/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
render:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api-docs.render.com/docs/api-spec)
- [api-emulator](https://github.com/jsj/api-emulator)
