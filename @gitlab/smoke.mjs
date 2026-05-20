import assert from 'node:assert/strict';
import { createApp, Store, withServer } from '../scripts/cli-smoke-runtime.mjs';
import { contract, plugin, seedFromConfig } from './api-emulator/src/index.js';

const app = createApp();
const store = new Store();
const externalBaseUrl = 'https://gitlab.example';
plugin.register(app, store, undefined, externalBaseUrl);

assert.equal(contract.service, 'gitlab');

seedFromConfig(store, externalBaseUrl, {
  issues: [{
    project_id: 1000,
    iid: 1,
    title: 'Seeded issue',
    description: 'Fixture issue',
    labels: ['bug'],
    state: 'opened',
    assignees: [],
  }],
  iterations: [{ group_path: 'example/team', title: 'Current iteration', state: 'current' }],
});

await withServer(app, async (baseUrl) => {
  const user = await fetch(`${baseUrl}/api/v4/user`);
  assert.equal((await user.json()).username, 'sample-user');

  const projectPath = encodeURIComponent('example/team/sample-project');
  const project = await fetch(`${baseUrl}/api/v4/projects/${projectPath}`);
  assert.equal((await project.json()).path_with_namespace, 'example/team/sample-project');

  const issues = await fetch(`${baseUrl}/api/v4/projects/${projectPath}/issues?labels=bug`);
  assert.equal((await issues.json()).length, 1);

  const created = await fetch(`${baseUrl}/api/v4/projects/${projectPath}/issues`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ title: 'Smoke issue', labels: 'smoke' }),
  });
  assert.equal(created.status, 201);
  assert.equal((await created.json()).title, 'Smoke issue');

  const mergeRequest = await fetch(`${baseUrl}/api/v4/projects/${projectPath}/merge_requests/1`);
  assert.equal((await mergeRequest.json()).title, 'Improve sample validation flow');

  const iterations = await fetch(`${baseUrl}/api/v4/groups/${encodeURIComponent('example/team')}/iterations?state=current`);
  assert.equal((await iterations.json())[0].title, 'Current iteration');
});

console.log('gitlab smoke ok');
