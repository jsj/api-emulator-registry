# @api-emulator/canvas

Canvas LMS provides education APIs for users, courses, assignments, enrollments, submissions, and learning workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/canvas
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@canvas/api-emulator.mjs --service canvas
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/v1/users/self`
- `GET /api/v1/users/:id`
- `GET /api/v1/courses`
- `GET /api/v1/courses/:course_id`
- `GET /api/v1/courses/:course_id/assignments`
- `GET /api/v1/courses/:course_id/assignments/:id`
- `POST /api/v1/courses/:course_id/assignments`
- `GET /api/v1/courses/:course_id/assignments/:assignment_id/submissions`
- `GET /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id`
- `POST /api/v1/courses/:course_id/assignments/:assignment_id/submissions`
- `GET /canvas/inspect/contract`
- `GET /canvas/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
canvas:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developerdocs.instructure.com/services/canvas)
- [api-emulator](https://github.com/jsj/api-emulator)
