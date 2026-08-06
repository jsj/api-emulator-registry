# @api-emulator/google-classroom

Google Classroom provides course, roster, teacher, student, and coursework APIs for education workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/google-classroom
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@google-classroom/api-emulator.mjs --service google-classroom
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /$discovery/rest`
- `GET /v1/courses`
- `POST /v1/courses`
- `GET /v1/courses/:id`
- `GET /v1/courses/:courseId/teachers`
- `GET /v1/courses/:courseId/students`
- `GET /v1/courses/:courseId/courseWork`
- `GET /google-classroom/inspect/contract`
- `GET /google-classroom/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
google-classroom:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.google.com/workspace/classroom/reference/rest)
- [api-emulator](https://github.com/jsj/api-emulator)
