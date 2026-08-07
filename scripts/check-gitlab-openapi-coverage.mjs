import { readFile } from 'node:fs/promises';

const GITLAB_VERSION = '19.2.1';
const OPENAPI_URL = `https://gitlab.com/api/v4/projects/278964/repository/files/doc%2Fapi%2Fopenapi%2Fopenapi_v3.yaml/raw?ref=v${GITLAB_VERSION}-ee`;
const PLUGIN_SOURCE = new URL('../providers/@gitlab/api-emulator/src/index.js', import.meta.url);

const deepRoutes = [
  ['get', '/api/v4/user', 'app.get("/api/v4/user"'],
  ['get', '/api/v4/users', 'app.get("/api/v4/users"'],
  ['get', '/api/v4/projects/{id}', 'app.get("/api/v4/projects/:project"'],
  ['get', '/api/v4/projects/{id}/issues', 'app.get("/api/v4/projects/:project/issues"'],
  ['post', '/api/v4/projects/{id}/issues', 'app.post("/api/v4/projects/:project/issues"'],
  ['get', '/api/v4/projects/{id}/issues/{issue_iid}', 'app.get("/api/v4/projects/:project/issues/:iid"'],
  ['put', '/api/v4/projects/{id}/issues/{issue_iid}', 'app.put("/api/v4/projects/:project/issues/:iid"'],
  ['post', '/api/v4/projects/{id}/issues/{noteable_id}/notes', 'app.post("/api/v4/projects/:project/issues/:iid/notes"'],
  ['get', '/api/v4/projects/{id}/merge_requests', 'app.get("/api/v4/projects/:project/merge_requests"'],
  ['post', '/api/v4/projects/{id}/merge_requests', 'app.post("/api/v4/projects/:project/merge_requests"'],
  ['get', '/api/v4/projects/{id}/merge_requests/{merge_request_iid}', 'app.get("/api/v4/projects/:project/merge_requests/:iid"'],
  ['put', '/api/v4/projects/{id}/merge_requests/{merge_request_iid}', 'app.put("/api/v4/projects/:project/merge_requests/:iid"'],
  ['get', '/api/v4/projects/{id}/merge_requests/{merge_request_iid}/changes', 'app.get("/api/v4/projects/:project/merge_requests/:iid/changes"'],
  ['get', '/api/v4/projects/{id}/merge_requests/{merge_request_iid}/diffs', 'app.get("/api/v4/projects/:project/merge_requests/:iid/diffs"'],
  ['get', '/api/v4/projects/{id}/merge_requests/{merge_request_iid}/versions', 'app.get("/api/v4/projects/:project/merge_requests/:iid/versions"'],
  ['get', '/api/v4/projects/{id}/merge_requests/{noteable_id}/notes', 'app.get("/api/v4/projects/:project/merge_requests/:iid/notes"'],
  ['post', '/api/v4/projects/{id}/merge_requests/{noteable_id}/notes', 'app.post("/api/v4/projects/:project/merge_requests/:iid/notes"'],
  ['get', '/api/v4/projects/{id}/merge_requests/{noteable_id}/discussions', 'app.get("/api/v4/projects/:project/merge_requests/:iid/discussions"'],
  ['post', '/api/v4/projects/{id}/merge_requests/{noteable_id}/discussions', 'app.post("/api/v4/projects/:project/merge_requests/:iid/discussions"'],
  ['get', '/api/v4/groups/{id}/iterations', 'app.get("/api/v4/groups/:group/iterations"'],
];

async function loadOpenApi() {
  if (process.env.GITLAB_OPENAPI_PATH) {
    return readFile(process.env.GITLAB_OPENAPI_PATH, 'utf8');
  }

  const response = await fetch(OPENAPI_URL, { headers: { 'user-agent': 'api-emulator-contract-check' } });
  if (!response.ok) {
    throw new Error(`Failed to fetch GitLab ${GITLAB_VERSION} OpenAPI schema: ${response.status}`);
  }
  return response.text();
}

function parseOpenApiOperations(openapi) {
  const operations = [];
  let currentPath = null;
  let pathIndent = null;

  for (const line of openapi.split('\n')) {
    const pathMatch = line.match(/^(\s+)"(\/.*)":\s*$/);
    if (pathMatch) {
      pathIndent = pathMatch[1].length;
      currentPath = pathMatch[2];
      continue;
    }

    const methodMatch = line.match(/^(\s+)(get|post|put|patch|delete|head|options):\s*$/);
    if (currentPath && pathIndent !== null && methodMatch && methodMatch[1].length > pathIndent) {
      operations.push({ method: methodMatch[2], path: currentPath });
    }
  }

  return operations;
}

const [openapi, pluginSource] = await Promise.all([loadOpenApi(), readFile(PLUGIN_SOURCE, 'utf8')]);
const operations = parseOpenApiOperations(openapi);
const failures = [];
const fallbackPresent =
  pluginSource.includes('stateful-core-plus-openapi-compatible-generic-fallback') &&
  pluginSource.includes('function registerGitLabOpenApiAdapter') &&
  pluginSource.includes('app.all("/api/v4/*", handler)');

if (operations.length < 1500) {
  failures.push(`GitLab OpenAPI parse found too few operations: ${operations.length}`);
}
if (!fallbackPresent) failures.push('missing generic /api/v4/* GitLab OpenAPI adapter');

for (const [method, path, route] of deepRoutes) {
  if (!operations.some((operation) => operation.method === method && operation.path === path)) {
    failures.push(`missing ${method.toUpperCase()} ${path} in GitLab ${GITLAB_VERSION} OpenAPI`);
  }
  if (!pluginSource.includes(route)) failures.push(`missing stateful emulator route ${route}`);
}

const declaredCount = Number(pluginSource.match(/openapiRouteCount:\s*(\d+)/)?.[1]);
if (declaredCount !== operations.length) {
  failures.push(`contract openapiRouteCount ${declaredCount || 'missing'} does not match spec operation count ${operations.length}`);
}

const declaredVersion = pluginSource.match(/openapiVersion:\s*"GitLab ([^"]+)"/)?.[1];
if (declaredVersion !== GITLAB_VERSION) {
  failures.push(`contract OpenAPI version ${declaredVersion ?? 'missing'} does not match pinned GitLab ${GITLAB_VERSION}`);
}

if (failures.length > 0) {
  console.error('GitLab OpenAPI coverage check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`gitlab ${GITLAB_VERSION} openapi coverage ok (${operations.length} operations, ${deepRoutes.length} stateful overrides)`);
