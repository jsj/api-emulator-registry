# @api-emulator/jira

Jira provides issue tracking APIs for users, projects, issues, search, and workflow-oriented project management.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/jira
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@jira/api-emulator.mjs --service jira
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /rest/api/3/myself`
- `GET /rest/api/2/myself`
- `GET /rest/api/3/serverInfo`
- `GET /rest/api/2/serverInfo`
- `GET /rest/api/3/project`
- `GET /rest/api/2/project`
- `GET /rest/api/3/project/search`
- `GET /rest/api/3/search`
- `GET /rest/api/2/search`
- `GET /rest/api/3/search/jql`
- `POST /rest/api/3/search`
- `POST /rest/api/2/search`
- `POST /rest/api/3/search/jql`
- `GET /rest/api/3/issue/:issueIdOrKey`
- `GET /rest/api/2/issue/:issueIdOrKey`
- `POST /rest/api/3/issue`
- `PUT /rest/api/3/issue/:issueIdOrKey`
- `PUT /rest/api/2/issue/:issueIdOrKey`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
jira:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [api-emulator](https://github.com/jsj/api-emulator)
