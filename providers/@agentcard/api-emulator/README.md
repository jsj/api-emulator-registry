# @api-emulator/agentcard

Agentcard provides virtual card APIs for CLI auth, payment methods, card creation, balances, transactions, plans, settings, and support chat.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/agentcard
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@agentcard/api-emulator.mjs --service agentcard
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /auth/me`
- `POST /auth/signup`
- `GET /users/me/mode`
- `POST /users/me/mode`
- `GET /settings`
- `PUT /settings`
- `PATCH /settings`
- `GET /cards`
- `POST /cards/user-info`
- `POST /cards/create`
- `POST /cards/create/approved`
- `GET /cards/:cardId/details`
- `GET /cards/:cardId/details/approved`
- `GET /cards/:cardId/balance`
- `GET /cards/:cardId/transactions`
- `POST /approvals/:approvalId/resolve`
- `POST /payment-methods/setup`
- `GET /payment-methods/status`
- `GET /payment-methods/list`
- `POST /payment-methods/default`
- `DELETE /payment-methods/:paymentMethodId`
- `GET /subscriptions/status`
- `POST /subscriptions/checkout`
- `POST /subscriptions/cancel`
- `POST /kyc/start`
- `GET /kyc/status`
- `POST /chat/conversations`
- `GET /chat/conversations/:conversationId/messages`
- `POST /chat/conversations/:conversationId/messages`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
agentcard:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.agentcard.sh/agent.txt)
- [api-emulator](https://github.com/jsj/api-emulator)
