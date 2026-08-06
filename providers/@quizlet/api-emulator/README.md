# @api-emulator/quizlet

Quizlet API 2.0 provides education APIs for users, study sets, terms, and flashcard creation workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/quizlet
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@quizlet/api-emulator.mjs --service quizlet
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
quizlet:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://quizlet.com/api/2.0/docs)
- [api-emulator](https://github.com/jsj/api-emulator)
