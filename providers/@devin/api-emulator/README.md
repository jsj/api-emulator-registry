# @api-emulator/devin

Devin provides AI engineering agent APIs for sessions, messages, PR reviews, users, and knowledge notes.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/devin
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@devin/api-emulator.mjs --service devin
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v3/self`
- `GET /v3/enterprise/organizations/:orgId/members/users`
- `GET /v3/organizations/:orgId/sessions`
- `POST /v3/organizations/:orgId/sessions`
- `GET /v3/organizations/:orgId/sessions/:devinId`
- `POST /v3/organizations/:orgId/sessions/:devinId/messages`
- `GET /v3/organizations/:orgId/pr-reviews`
- `POST /v3/organizations/:orgId/pr-reviews`
- `POST /v3/organizations/:orgId/knowledge/notes`
- `GET /devin/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
devin:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.devin.ai/api-reference/overview)
- [api-emulator](https://github.com/jsj/api-emulator)
