# @api-emulator/proton-mail

Proton Mail provides mail APIs for labels, messages, mailbox state, and read/unread workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/proton-mail
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@proton-mail/api-emulator.mjs --service proton-mail
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /core/v4/labels`
- `POST /core/v4/labels`
- `GET /mail/v4/messages`
- `GET /mail/v4/messages/:messageId`
- `PUT /mail/v4/messages/read`
- `PUT /mail/v4/messages/unread`
- `GET /proton-mail/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
proton-mail:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/ProtonMail/go-proton-api)
- [api-emulator](https://github.com/jsj/api-emulator)
