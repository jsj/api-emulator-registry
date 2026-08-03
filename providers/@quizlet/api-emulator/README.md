# @api-emulator/quizlet

Quizlet API 2.0 provides education APIs for users, study sets, terms, and flashcard creation workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/quizlet
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@quizlet/api-emulator.mjs --service quizlet
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /2.0/users/:username`
- `GET /2.0/users/:username/sets`
- `GET /2.0/search/sets`
- `GET /2.0/sets/:id`
- `GET /2.0/sets/:id/terms`
- `GET /2.0/sets`
- `POST /2.0/sets`
- `PUT /2.0/sets/:id`
- `DELETE /2.0/sets/:id`
- `GET /quizlet/inspect/contract`
- `GET /quizlet/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
quizlet:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://quizlet.com/api/2.0/docs)
- [api-emulator](https://github.com/jsj/api-emulator)
