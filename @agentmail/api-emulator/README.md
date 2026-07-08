# @api-emulator/agentmail

AgentMail provides email inbox APIs for agent inbox provisioning, message listing, sending, and threaded replies.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/agentmail
```

## Run

```bash
npx -p api-emulator api --plugin ./@agentmail/api-emulator.mjs --service agentmail
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

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

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
agentmail:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.agentmail.to/openapi.json)
- [api-emulator](https://github.com/jsj/api-emulator)
