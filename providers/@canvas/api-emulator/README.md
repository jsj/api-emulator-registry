# @api-emulator/canvas

Canvas LMS provides education APIs for users, courses, assignments, enrollments, submissions, and learning workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/canvas
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@canvas/api-emulator.mjs --service canvas
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

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

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
canvas:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developerdocs.instructure.com/services/canvas)
- [api-emulator](https://github.com/jsj/api-emulator)
