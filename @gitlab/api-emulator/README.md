# @api-emulator/gitlab

GitLab provides a local API v4 emulator for user, project, issue, merge request, note, discussion, and iteration workflows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/gitlab
```

## Run

```bash
npx -p api-emulator api --plugin ./@gitlab/api-emulator/src/index.js --service gitlab
```

## Endpoints

- `GET /api/v4/user` — returns the authenticated sample user.
- `GET /api/v4/projects/:project` — returns a project by URL-encoded full path.
- `GET/POST/PUT /api/v4/projects/:project/issues` — lists, creates, fetches, and updates issues.
- `GET/POST /api/v4/projects/:project/merge_requests/:iid/notes` — lists and creates merge request notes.
- `GET/POST /api/v4/projects/:project/merge_requests/:iid/discussions` — lists and creates merge request discussions.
- `GET /api/v4/projects/:project/merge_requests/:iid` — returns merge request details, changes, diffs, and versions.
- `GET /api/v4/groups/:group/iterations` — lists group iterations.

## Auth

No production credentials are required. Clients can use any fake token through `PRIVATE-TOKEN`, `Authorization`, or `glab auth login` with a local API host.

## Seed Configuration

```yaml
gitlab:
  projects: []
  issues: []
  iterations: []
  merge_requests: []
```

## Links

- [Official API docs](https://docs.gitlab.com/api/)
- [glab CLI](https://gitlab.com/gitlab-org/cli)
- [api-emulator](https://github.com/jsj/api-emulator)
