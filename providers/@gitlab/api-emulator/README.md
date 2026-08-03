# @api-emulator/gitlab

GitLab provides source hosting APIs for users, projects, issues, merge requests, discussions, notes, and iterations.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/gitlab
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@gitlab/api-emulator/src/index.js --service gitlab
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /api/v4/user`
- `GET /api/v4/projects/:project`
- `GET /api/v4/projects/:project/issues`
- `POST /api/v4/projects/:project/issues`
- `GET /api/v4/projects/:project/issues/:iid`
- `PUT /api/v4/projects/:project/issues/:iid`
- `POST /api/v4/projects/:project/issues/:iid/notes`
- `GET /api/v4/projects/:project/merge_requests/:iid`
- `GET /api/v4/projects/:project/merge_requests/:iid/changes`
- `GET /api/v4/projects/:project/merge_requests/:iid/diffs`
- `GET /api/v4/projects/:project/merge_requests/:iid/versions`
- `POST /api/v4/projects/:project/merge_requests/:iid/notes`
- `GET /api/v4/projects/:project/merge_requests/:iid/notes`
- `POST /api/v4/projects/:project/merge_requests/:iid/discussions`
- `GET /api/v4/projects/:project/merge_requests/:iid/discussions`
- `GET /api/v4/groups/:group/iterations`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
gitlab:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
