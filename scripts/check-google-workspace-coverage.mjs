import { contract } from '../providers/@google/api-emulator.mjs';

const expectedServices = [
  'drive',
  'sheets',
  'gmail',
  'calendar',
  'docs',
  'slides',
  'tasks',
  'people',
  'chat',
  'vault',
  'groupssettings',
  'reseller',
  'licensing',
  'script',
  'admin',
  'reports',
  'classroom',
  'cloudidentity',
  'alertcenter',
  'forms',
  'keep',
  'meet',
  'workspaceevents',
  'pubsub',
];

const failures = [];

for (const service of expectedServices) {
  if (!contract.scope.includes(service)) {
    failures.push(`missing Google Workspace service coverage: ${service}`);
  }
}

for (const prefix of ['/:service/:version/*', '/upload/:service/:version/*', '/$discovery/rest']) {
  if (!contract.adapterRoutePrefixes.includes(prefix)) {
    failures.push(`missing Workspace adapter route prefix: ${prefix}`);
  }
}

const requiredReadEndpoints = [
  'GET /docs/v1/documents/:documentId',
  'GET /v1/documents/:documentId',
  'GET /sheets/v4/spreadsheets/:spreadsheetId',
  'GET /v4/spreadsheets/:spreadsheetId',
  'GET /sheets/v4/spreadsheets/:spreadsheetId/values/:range',
  'GET /v4/spreadsheets/:spreadsheetId/values/:range',
];

for (const endpoint of requiredReadEndpoints) {
  if (!contract.exactReadEndpoints?.includes(endpoint)) failures.push(`missing exact Google Workspace read endpoint: ${endpoint}`);
}

if (contract.discoveryServiceCount !== expectedServices.length) {
  failures.push(`discoveryServiceCount ${contract.discoveryServiceCount} does not match expected ${expectedServices.length}`);
}

if (!contract.fidelity.includes('generic-fallback')) {
  failures.push('contract fidelity must declare generic fallback coverage');
}

if (failures.length) {
  console.error('Google Workspace coverage check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`google workspace coverage ok (${expectedServices.length} services, ${requiredReadEndpoints.length} exact Docs/Sheets read endpoints, generic adapter)`);
