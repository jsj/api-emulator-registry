# Build a private API emulator

Use a private provider for an internal API or an API contract that you cannot publish.

Copy this prompt to your coding agent:

```text
Create a private api-emulator provider for this repository.
First, read https://api-emulator.jsj.sh/agent.txt.
Keep the provider and its catalog in a private repository.
Inspect the repository and identify the smallest internal API workflow that its tests need.
Use only API documentation, schemas, and examples that I am allowed to use.
Do not copy production credentials, access tokens, personal data, customer data, logs, or production requests and responses.
Use clearly fake names, identifiers, email addresses, and records for every fixture.
Keep the existing SDK in the application.
Change only its base URL and test credentials.
Create one provider plugin for the required routes.
Add the provider to the private catalog.
Store state in the emulator so tests can create, read, update, and reset fake records.
Reject missing or invalid test credentials when the real API requires authentication.
Add a smoke test for one representative workflow.
Run the test against the local emulator.
Reset emulator state after the test.
Before you finish, search the new files for secrets and personal data.
Report the changed files, local URL, test command, test result, and remaining gaps.
```

Do not attach private contracts or data to a public issue. If a reusable provider uses only public information, you can [request a public provider](https://github.com/jsj/api-emulator-registry/issues/new?template=provider.yml).
