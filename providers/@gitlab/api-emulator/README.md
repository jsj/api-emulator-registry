# @api-emulator/gitlab

GitLab provides source hosting APIs for users, projects, issues, merge requests, discussions, notes, and iterations.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/gitlab
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@gitlab/api-emulator/src/index.js --service gitlab
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/v4/user`
- `GET /api/v4/users?username=<username>`
- `GET /api/v4/projects/:project`
- `GET /api/v4/projects/:project/issues`
- `POST /api/v4/projects/:project/issues`
- `GET /api/v4/projects/:project/issues/:iid`
- `PUT /api/v4/projects/:project/issues/:iid`
- `POST /api/v4/projects/:project/issues/:iid/notes`
- `GET /api/v4/projects/:project/merge_requests/:iid`
- `GET /api/v4/projects/:project/merge_requests`
- `POST /api/v4/projects/:project/merge_requests`
- `PUT /api/v4/projects/:project/merge_requests/:iid`
- `GET /api/v4/projects/:project/merge_requests/:iid/changes`
- `GET /api/v4/projects/:project/merge_requests/:iid/diffs`
- `GET /api/v4/projects/:project/merge_requests/:iid/versions`
- `POST /api/v4/projects/:project/merge_requests/:iid/notes`
- `GET /api/v4/projects/:project/merge_requests/:iid/notes`
- `POST /api/v4/projects/:project/merge_requests/:iid/discussions`
- `GET /api/v4/projects/:project/merge_requests/:iid/discussions`
- `GET /api/v4/groups/:group/iterations`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Clients can use any fake token through
`PRIVATE-TOKEN`, `Authorization`, or `glab auth login` with a local API host.

## Test data

Add repeatable test data to the provider configuration.

```yaml
gitlab:
  projects: []
  issues: []
  iterations: []
  merge_requests: []
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
