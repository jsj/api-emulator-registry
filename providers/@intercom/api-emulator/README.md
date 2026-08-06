# @api-emulator/intercom

Intercom provides customer-support APIs for admins, contacts, conversations, replies, and inbox workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/intercom
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@intercom/api-emulator.mjs --service intercom
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /admins`
- `GET /admins/:id`
- `GET /contacts`
- `POST /contacts`
- `GET /contacts/:id`
- `GET /conversations`
- `POST /conversations/search`
- `GET /conversations/:id`
- `POST /conversations/:id/reply`
- `POST /conversations/:id/parts`
- `GET /inspect/contract`
- `GET /inspect/state`
- `GET /inspect/now`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
intercom:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.intercom.com/docs/references/rest-api/api.intercom.io)
- [api-emulator](https://github.com/jsj/api-emulator)
