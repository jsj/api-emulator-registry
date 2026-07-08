# @api-emulator/gitlab

GitLab provides source hosting APIs for users, projects, issues, merge requests, discussions, notes, and iterations.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/gitlab
```

## Run

```bash
npx -p api-emulator api --plugin ./@gitlab/api-emulator/src/index.js --service gitlab
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

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

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
gitlab:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
