# @api-emulator/agentcard

Agentcard provides virtual card APIs for CLI auth, payment methods, card creation, balances, transactions, plans, settings, and support chat.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/agentcard
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@agentcard/api-emulator.mjs --service agentcard
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

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

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
agentcard:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.agentcard.sh/agent.txt)
- [api-emulator](https://github.com/jsj/api-emulator)
