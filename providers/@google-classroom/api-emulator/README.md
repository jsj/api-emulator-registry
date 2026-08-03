# @api-emulator/google-classroom

Google Classroom provides course, roster, teacher, student, and coursework APIs for education workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/google-classroom
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@google-classroom/api-emulator.mjs --service google-classroom
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /$discovery/rest`
- `GET /v1/courses`
- `POST /v1/courses`
- `GET /v1/courses/:id`
- `GET /v1/courses/:courseId/teachers`
- `GET /v1/courses/:courseId/students`
- `GET /v1/courses/:courseId/courseWork`
- `GET /google-classroom/inspect/contract`
- `GET /google-classroom/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
google-classroom:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.google.com/workspace/classroom/reference/rest)
- [api-emulator](https://github.com/jsj/api-emulator)
