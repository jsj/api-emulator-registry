# @api-emulator/agentmail

AgentMail provides email inbox APIs for agent inbox provisioning, message listing, sending, and threaded replies.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/agentmail
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@agentmail/api-emulator.mjs --service agentmail
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

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

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
agentmail:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.agentmail.to/openapi.json)
- [api-emulator](https://github.com/jsj/api-emulator)
