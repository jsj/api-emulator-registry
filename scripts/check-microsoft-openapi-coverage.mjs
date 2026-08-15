import { readFile } from 'node:fs/promises';

const OPENAPI_COMMIT = 'bd05c95ec804b2eec35e787a524976b67f9a5e36';
const OPENAPI_URL = `https://raw.githubusercontent.com/microsoftgraph/msgraph-metadata/${OPENAPI_COMMIT}/openapi/v1.0/openapi.yaml`;
const PLUGIN_SOURCE = new URL('../providers/@microsoft/api-emulator/src/index.ts', import.meta.url);
const FALLBACK_SOURCE = new URL('../providers/@microsoft/api-emulator/src/routes/graph-fallback.ts', import.meta.url);

async function loadOpenApi() {
  if (process.env.MICROSOFT_GRAPH_OPENAPI_PATH) return readFile(process.env.MICROSOFT_GRAPH_OPENAPI_PATH, 'utf8');
  const response = await fetch(OPENAPI_URL);
  if (!response.ok) throw new Error(`Failed to fetch Microsoft Graph OpenAPI schema: ${response.status}`);
  return response.text();
}

function operationCount(openapi) {
  return [...openapi.matchAll(/^    (get|post|put|patch|delete):$/gm)].length;
}

const [openapi, pluginSource, fallbackSource] = await Promise.all([
  loadOpenApi(),
  readFile(PLUGIN_SOURCE, 'utf8'),
  readFile(FALLBACK_SOURCE, 'utf8'),
]);

const count = operationCount(openapi);
const declaredCount = Number(pluginSource.match(/openapiOperationCount:\s*(\d+)/)?.[1]);
const declaredCommit = pluginSource.match(/openapiCommit:\s*["']([^"']+)/)?.[1];
const methods = ['get', 'post', 'patch', 'put', 'delete'];
const missingMethods = methods.filter((method) => !fallbackSource.includes(`app.${method}("/v1.0/*"`));
const failures = [];

if (declaredCount !== count) failures.push(`declared operation count ${declaredCount} does not match ${count}`);
if (declaredCommit !== OPENAPI_COMMIT) failures.push(`declared commit ${declaredCommit} does not match ${OPENAPI_COMMIT}`);
if (missingMethods.length) failures.push(`fallback does not support: ${missingMethods.join(', ')}`);

if (failures.length) {
  console.error('Microsoft Graph OpenAPI coverage check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`microsoft graph openapi coverage ok (${count} operations at ${OPENAPI_COMMIT.slice(0, 12)})`);
