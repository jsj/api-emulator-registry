import { fixedNow, getState, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'azure:state';

function defaultState() {
  return {
    subscriptionId: '00000000-0000-0000-0000-000000000000',
    tenantId: '11111111-1111-1111-1111-111111111111',
    subscriptions: [
      {
        id: '/subscriptions/00000000-0000-0000-0000-000000000000',
        subscriptionId: '00000000-0000-0000-0000-000000000000',
        tenantId: '11111111-1111-1111-1111-111111111111',
        displayName: 'Azure Emulator Subscription',
        state: 'Enabled',
        subscriptionPolicies: { locationPlacementId: 'Public_2014-09-01', quotaId: 'FreeTrial_2014-09-01', spendingLimit: 'Off' },
        authorizationSource: 'RoleBased',
      },
    ],
    locations: [
      { id: '/subscriptions/00000000-0000-0000-0000-000000000000/locations/eastus', name: 'eastus', displayName: 'East US', regionalDisplayName: '(US) East US', metadata: { regionType: 'Physical', geographyGroup: 'US', longitude: '-79.8164', latitude: '37.3719', physicalLocation: 'Virginia' } },
      { id: '/subscriptions/00000000-0000-0000-0000-000000000000/locations/westus2', name: 'westus2', displayName: 'West US 2', regionalDisplayName: '(US) West US 2', metadata: { regionType: 'Physical', geographyGroup: 'US', longitude: '-119.852', latitude: '47.233', physicalLocation: 'Washington' } },
    ],
    resourceGroups: [
      { id: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/emulator-rg', name: 'emulator-rg', type: 'Microsoft.Resources/resourceGroups', location: 'eastus', tags: { environment: 'emulator' }, properties: { provisioningState: 'Succeeded' } },
    ],
    providers: [
      {
        id: '/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Resources',
        namespace: 'Microsoft.Resources',
        registrationState: 'Registered',
        resourceTypes: [
          { resourceType: 'resourceGroups', locations: ['eastus', 'westus2'], apiVersions: ['2021-04-01'] },
          { resourceType: 'deployments', locations: ['eastus', 'westus2'], apiVersions: ['2021-04-01'] },
        ],
      },
      {
        id: '/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Compute',
        namespace: 'Microsoft.Compute',
        registrationState: 'Registered',
        resourceTypes: [{ resourceType: 'virtualMachines', locations: ['eastus', 'westus2'], apiVersions: ['2023-03-01'] }],
      },
    ],
    resources: [
      {
        id: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/emulator-rg/providers/Microsoft.Compute/virtualMachines/emulator-vm',
        name: 'emulator-vm',
        type: 'Microsoft.Compute/virtualMachines',
        location: 'eastus',
        resourceGroup: 'emulator-rg',
        tags: { environment: 'emulator' },
        properties: { provisioningState: 'Succeeded', vmId: 'vm-emulator-0001' },
      },
    ],
    deployments: [
      {
        id: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/emulator-rg/providers/Microsoft.Resources/deployments/emulator-deployment',
        name: 'emulator-deployment',
        type: 'Microsoft.Resources/deployments',
        location: 'eastus',
        properties: {
          provisioningState: 'Succeeded',
          timestamp: fixedNow,
          mode: 'Incremental',
          outputs: {},
          dependencies: [],
        },
      },
    ],
  };
}

const state = (store) => getState(store, STATE_KEY, defaultState);
const save = (store, next) => setState(store, STATE_KEY, next);
const armError = (c, status, code, message) => c.json({ error: { code, message } }, status);
const groupId = (subscriptionId, name) => `/subscriptions/${subscriptionId}/resourceGroups/${name}`;
const deploymentId = (subscriptionId, groupName, name) => `${groupId(subscriptionId, groupName)}/providers/Microsoft.Resources/deployments/${name}`;
const ok = (c, body, status = 200) => c.json(body, status, { 'x-ms-request-id': 'azure_req_emulator', 'x-ms-correlation-request-id': 'azure_corr_emulator' });

function subscription(store, subscriptionId) {
  return state(store).subscriptions.find((item) => item.subscriptionId === subscriptionId);
}

function byGroup(store, name) {
  return state(store).resourceGroups.find((item) => item.name.toLowerCase() === name.toLowerCase());
}

function groupResources(store, name) {
  return state(store).resources.filter((item) => item.resourceGroup.toLowerCase() === name.toLowerCase());
}

export const contract = {
  provider: 'azure',
  source: 'Azure Resource Manager OpenAPI specifications',
  docs: 'https://learn.microsoft.com/en-us/rest/api/resources/resource-groups',
  baseUrl: 'https://management.azure.com',
  auth: 'Bearer token',
  scope: ['subscriptions', 'locations', 'providers', 'resource-groups', 'resources', 'deployments'],
  fidelity: 'stateful-arm-rest-emulator',
};

export const plugin = {
  name: 'azure',
  register(app, store) {
    app.get('/subscriptions', (c) => ok(c, { value: state(store).subscriptions }));
    app.get('/subscriptions/:subscriptionId', (c) => {
      const found = subscription(store, c.req.param('subscriptionId'));
      if (!found) return armError(c, 404, 'SubscriptionNotFound', 'The subscription could not be found.');
      return ok(c, found);
    });
    app.get('/subscriptions/:subscriptionId/locations', (c) => ok(c, { value: state(store).locations }));
    app.get('/providers', (c) => ok(c, { value: state(store).providers.map((item) => ({ ...item, id: `/providers/${item.namespace}` })) }));
    app.get('/providers/:providerNamespace', (c) => getProvider(c, store));
    app.get('/subscriptions/:subscriptionId/providers', (c) => ok(c, { value: state(store).providers }));
    app.get('/subscriptions/:subscriptionId/providers/:providerNamespace', (c) => getProvider(c, store));
    app.get('/subscriptions/:subscriptionId/resources', (c) => ok(c, { value: filterResources(c, store) }));
    app.get('/subscriptions/:subscriptionId/resourcegroups', (c) => ok(c, { value: state(store).resourceGroups }));
    app.get('/subscriptions/:subscriptionId/resourceGroups', (c) => ok(c, { value: state(store).resourceGroups }));
    app.get('/subscriptions/:subscriptionId/resourcegroups/:resourceGroupName/resources', (c) => ok(c, { value: groupResources(store, c.req.param('resourceGroupName')) }));
    app.get('/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/resources', (c) => ok(c, { value: groupResources(store, c.req.param('resourceGroupName')) }));
    app.get('/subscriptions/:subscriptionId/resourcegroups/:resourceGroupName/providers/Microsoft.Resources/deployments', (c) => listDeployments(c, store));
    app.get('/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Resources/deployments', (c) => listDeployments(c, store));
    app.get('/subscriptions/:subscriptionId/resourcegroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName', (c) => getDeployment(c, store));
    app.get('/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName', (c) => getDeployment(c, store));
    app.put('/subscriptions/:subscriptionId/resourcegroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName', async (c) => upsertDeployment(c, store));
    app.put('/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName', async (c) => upsertDeployment(c, store));
    app.delete('/subscriptions/:subscriptionId/resourcegroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName', (c) => deleteDeployment(c, store));
    app.delete('/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName', (c) => deleteDeployment(c, store));
    app.get('/subscriptions/:subscriptionId/resourcegroups/:resourceGroupName', (c) => {
      const group = byGroup(store, c.req.param('resourceGroupName'));
      if (!group) return armError(c, 404, 'ResourceGroupNotFound', 'Resource group could not be found.');
      return ok(c, group);
    });
    app.get('/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName', (c) => {
      const group = byGroup(store, c.req.param('resourceGroupName'));
      if (!group) return armError(c, 404, 'ResourceGroupNotFound', 'Resource group could not be found.');
      return ok(c, group);
    });
    app.put('/subscriptions/:subscriptionId/resourcegroups/:resourceGroupName', async (c) => upsertGroup(c, store));
    app.put('/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName', async (c) => upsertGroup(c, store));
    app.delete('/subscriptions/:subscriptionId/resourcegroups/:resourceGroupName', (c) => deleteGroup(c, store));
    app.delete('/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName', (c) => deleteGroup(c, store));
    app.get('/azure/inspect/state', (c) => c.json(state(store)));
  },
};

async function upsertGroup(c, store) {
  const s = state(store);
  const subscriptionId = c.req.param('subscriptionId');
  const name = c.req.param('resourceGroupName');
  const body = await c.req.json().catch(() => ({}));
  const existing = s.resourceGroups.find((item) => item.name.toLowerCase() === name.toLowerCase());
  const group = { id: groupId(subscriptionId, name), name, type: 'Microsoft.Resources/resourceGroups', location: body.location ?? existing?.location ?? 'eastus', tags: body.tags ?? existing?.tags ?? {}, properties: { provisioningState: 'Succeeded' } };
  if (existing) Object.assign(existing, group);
  else s.resourceGroups.push(group);
  save(store, s);
  return ok(c, group, existing ? 200 : 201);
}

function deleteGroup(c, store) {
  const s = state(store);
  const before = s.resourceGroups.length;
  s.resourceGroups = s.resourceGroups.filter((item) => item.name.toLowerCase() !== c.req.param('resourceGroupName').toLowerCase());
  s.resources = s.resources.filter((item) => item.resourceGroup.toLowerCase() !== c.req.param('resourceGroupName').toLowerCase());
  s.deployments = s.deployments.filter((item) => !item.id.toLowerCase().startsWith(groupId(c.req.param('subscriptionId'), c.req.param('resourceGroupName')).toLowerCase()));
  save(store, s);
  return before === s.resourceGroups.length ? armError(c, 404, 'ResourceGroupNotFound', 'Resource group could not be found.') : c.body(null, 204);
}

function getProvider(c, store) {
  const provider = state(store).providers.find((item) => item.namespace.toLowerCase() === c.req.param('providerNamespace').toLowerCase());
  if (!provider) return armError(c, 404, 'InvalidResourceNamespace', 'The resource namespace could not be found.');
  return ok(c, provider);
}

function filterResources(c, store) {
  const resourceType = c.req.query('$filter')?.match(/resourceType eq '([^']+)'/i)?.[1];
  if (!resourceType) return state(store).resources;
  return state(store).resources.filter((item) => item.type.toLowerCase() === resourceType.toLowerCase());
}

function listDeployments(c, store) {
  const groupName = c.req.param('resourceGroupName');
  return ok(c, { value: state(store).deployments.filter((item) => item.id.toLowerCase().includes(`/resourcegroups/${groupName.toLowerCase()}/`)) });
}

function getDeployment(c, store) {
  const found = state(store).deployments.find((item) => item.name.toLowerCase() === c.req.param('deploymentName').toLowerCase() && item.id.toLowerCase().includes(`/resourcegroups/${c.req.param('resourceGroupName').toLowerCase()}/`));
  if (!found) return armError(c, 404, 'DeploymentNotFound', 'Deployment could not be found.');
  return ok(c, found);
}

async function upsertDeployment(c, store) {
  const s = state(store);
  const subscriptionId = c.req.param('subscriptionId');
  const resourceGroupName = c.req.param('resourceGroupName');
  const name = c.req.param('deploymentName');
  const body = await c.req.json().catch(() => ({}));
  const existing = s.deployments.find((item) => item.name.toLowerCase() === name.toLowerCase() && item.id.toLowerCase().includes(`/resourcegroups/${resourceGroupName.toLowerCase()}/`));
  const deployment = {
    id: deploymentId(subscriptionId, resourceGroupName, name),
    name,
    type: 'Microsoft.Resources/deployments',
    location: byGroup(store, resourceGroupName)?.location ?? body.location ?? 'eastus',
    properties: {
      provisioningState: 'Succeeded',
      timestamp: fixedNow,
      mode: body.properties?.mode ?? 'Incremental',
      templateHash: '1234567890',
      parameters: body.properties?.parameters ?? {},
      outputs: body.properties?.template?.outputs ?? {},
      dependencies: [],
    },
  };
  if (existing) Object.assign(existing, deployment);
  else s.deployments.push(deployment);
  save(store, s);
  return ok(c, deployment, existing ? 200 : 201);
}

function deleteDeployment(c, store) {
  const s = state(store);
  const before = s.deployments.length;
  const groupName = c.req.param('resourceGroupName').toLowerCase();
  const deploymentName = c.req.param('deploymentName').toLowerCase();
  s.deployments = s.deployments.filter((item) => !(item.name.toLowerCase() === deploymentName && item.id.toLowerCase().includes(`/resourcegroups/${groupName}/`)));
  save(store, s);
  return before === s.deployments.length ? armError(c, 404, 'DeploymentNotFound', 'Deployment could not be found.') : c.body(null, 204);
}

export function seedFromConfig(store, _baseUrl, config = {}) {
  return save(store, { ...defaultState(), ...config });
}

export const label = 'Azure Resource Manager API emulator';
export const endpoints = 'ARM subscriptions, locations, providers, resource groups, resources, and deployments';
export const capabilities = contract.scope;
export const initConfig = { azure: { subscriptionId: defaultState().subscriptionId } };
export default plugin;
