# @api-emulator/intercom

Intercom provides customer-support APIs for admins, contacts, conversations, replies, and inbox workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/intercom
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@intercom/api-emulator.mjs --service intercom
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /admins`
- `GET /admins/:id`
- `GET /contacts`
- `POST /contacts`
- `GET /contacts/:id`
- `GET /conversations`
- `POST /conversations/search`
- `GET /conversations/:id`
- `POST /conversations/:id/reply`
- `POST /conversations/:id/parts`
- `GET /inspect/contract`
- `GET /inspect/state`
- `GET /inspect/now`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
intercom:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.intercom.com/docs/references/rest-api/api.intercom.io)
- [api-emulator](https://github.com/jsj/api-emulator)
