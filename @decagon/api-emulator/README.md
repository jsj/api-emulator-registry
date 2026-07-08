# @api-emulator/decagon

Decagon provides AI customer-support APIs for outbound chat messages and support automation workflows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/decagon
```

## Run

```bash
npx -p api-emulator api --plugin ./@decagon/api-emulator.mjs --service decagon
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `POST /chat/outbound`
- `GET /inspect/contract`
- `GET /inspect/state`

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
decagon:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.decagon.ai/api-reference/getting-started)
- [api-emulator](https://github.com/jsj/api-emulator)
