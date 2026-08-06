# @api-emulator/proton-mail

Proton Mail provides mail APIs for labels, messages, mailbox state, and read/unread workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/proton-mail
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@proton-mail/api-emulator.mjs --service proton-mail
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /core/v4/labels`
- `POST /core/v4/labels`
- `GET /mail/v4/messages`
- `GET /mail/v4/messages/:messageId`
- `PUT /mail/v4/messages/read`
- `PUT /mail/v4/messages/unread`
- `GET /proton-mail/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
proton-mail:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/ProtonMail/go-proton-api)
- [api-emulator](https://github.com/jsj/api-emulator)
