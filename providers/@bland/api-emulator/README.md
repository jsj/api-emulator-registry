# @api-emulator/bland

Bland provides voice AI APIs for account details, outbound calls, call logs, pathways, and agent tools.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/bland
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@bland/api-emulator.mjs --service bland
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/me`
- `GET /v1/calls`
- `GET /v1/active`
- `POST /v1/calls`
- `GET /v1/calls/:id`
- `POST /v1/calls/:id/analyze`
- `GET /v1/calls/:id/recording`
- `POST /v1/calls/:id/stop`
- `GET /v1/all_pathways`
- `POST /v1/pathways`
- `GET /v1/pathway/:id`
- `GET /v2/tools`
- `POST /v2/tools`
- `GET /v2/batches`
- `POST /v2/batches`
- `GET /v2/batches/:id`
- `POST /v2/batches/:id/stop`
- `GET /v1/contacts`
- `POST /v1/contacts/resolve`
- `GET /v1/inbound`
- `GET /v1/inbound/:phoneNumber`
- `GET /bland/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
bland:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.bland.ai/llms.txt)
- [api-emulator](https://github.com/jsj/api-emulator)
