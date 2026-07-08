# @api-emulator/agentcard

Agentcard provides virtual card APIs for CLI auth, payment methods, card creation, balances, transactions, plans, settings, and support chat.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/agentcard
```

## Run

```bash
npx -p api-emulator api --plugin ./@agentcard/api-emulator.mjs --service agentcard
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

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

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
agentcard:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.agentcard.sh/agent.txt)
- [api-emulator](https://github.com/jsj/api-emulator)
