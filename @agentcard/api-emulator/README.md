# @api-emulator/agentcard

Agentcard provides virtual card APIs for local `agent-cards` CLI testing.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/agentcard
```

## Run

```bash
npx -p api-emulator api --plugin ./@agentcard/api-emulator.mjs --service agentcard
```

## Endpoints

- `GET /auth/me` — returns the current fake user
- `POST /cards/create` — creates a sandbox virtual card
- `GET /cards` — lists cards
- `GET /cards/:cardId/details` — returns PAN, CVV, expiry, balance, and status
- `GET /cards/:cardId/balance` — returns card balance
- `GET /cards/:cardId/transactions` — lists card transactions
- `POST /payment-methods/setup` — returns a fake setup URL
- `GET /payment-methods/status` — reports saved payment-method status
- `GET /payment-methods/list` — lists saved payment methods
- `GET /subscriptions/status` — returns plan and usage limits
- `GET /settings` / `PATCH /settings` — reads and updates CLI settings

## Auth

The emulator accepts any deterministic bearer token, including `AGENT_CARDS_JWT=agentcard_emulator_jwt`.

## Seed Configuration

```yaml
agentcard:
  user:
    email: agent@example.com
  cards:
    - id: card_emulator_1
      spendLimitCents: 5000
```

## Links

- [Agentcard quick reference](https://www.agentcard.sh/agent.txt)
- [api-emulator](https://github.com/jsj/api-emulator)
