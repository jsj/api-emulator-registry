# @api-emulator/agentmail

AgentMail provides email inbox APIs for agent inbox provisioning, message listing, sending, and threaded replies.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/agentmail
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@agentmail/api-emulator.mjs --service agentmail
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v0/inboxes`
- `POST /v0/inboxes`
- `GET /v0/inboxes/:inbox_id`
- `PATCH /v0/inboxes/:inbox_id`
- `DELETE /v0/inboxes/:inbox_id`
- `GET /v0/inboxes/:inbox_id/messages`
- `POST /v0/inboxes/:inbox_id/messages/send`
- `GET /v0/inboxes/:inbox_id/messages/:message_id`
- `POST /v0/inboxes/:inbox_id/messages/:message_id/reply`
- `GET /agentmail/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
agentmail:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.agentmail.to/openapi.json)
- [api-emulator](https://github.com/jsj/api-emulator)
