import { fixedNow, getState, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'gcp:state';

function defaultState() {
  return {
    organizationId: '123456789012',
    billingAccountName: 'billingAccounts/000000-000000-000000',
    projects: [
      {
        projectId: 'emulator-project',
        projectNumber: '100000000001',
        name: 'Emulator Project',
        lifecycleState: 'ACTIVE',
        labels: { environment: 'emulator' },
        createTime: fixedNow,
        parent: { type: 'organization', id: '123456789012' },
      },
    ],
    zones: [
      { name: 'us-central1-a', region: 'us-central1', status: 'UP' },
      { name: 'us-central1-b', region: 'us-central1', status: 'UP' },
    ],
    instances: [
      {
        id: '200000000001',
        name: 'emulator-vm',
        zone: 'us-central1-a',
        machineType: 'e2-micro',
        status: 'RUNNING',
        creationTimestamp: fixedNow,
        networkInterfaces: [{ name: 'nic0', networkIP: '10.128.0.2', accessConfigs: [{ name: 'External NAT', natIP: '192.0.2.20', type: 'ONE_TO_ONE_NAT' }] }],
      },
    ],
    services: [
      { name: 'projects/emulator-project/services/compute.googleapis.com', config: { name: 'compute.googleapis.com', title: 'Compute Engine API' }, state: 'ENABLED' },
      { name: 'projects/emulator-project/services/cloudresourcemanager.googleapis.com', config: { name: 'cloudresourcemanager.googleapis.com', title: 'Cloud Resource Manager API' }, state: 'ENABLED' },
    ],
    nextProjectNumber: 100000000002,
    nextInstanceId: 200000000002,
    nextOperationId: 1,
  };
}

const state = (store) => getState(store, STATE_KEY, defaultState);
const save = (store, next) => setState(store, STATE_KEY, next);

function gcpError(c, status, code, message) {
  return c.json({ error: { code: status, message, status: code } }, status);
}

function projectResource(project) {
  return {
    name: `projects/${project.projectId}`,
    projectId: project.projectId,
    projectNumber: project.projectNumber,
    displayName: project.name,
    state: project.lifecycleState === 'ACTIVE' ? 'ACTIVE' : 'DELETE_REQUESTED',
    labels: project.labels,
    createTime: project.createTime,
    parent: project.parent ? `${project.parent.type}s/${project.parent.id}` : undefined,
  };
}

function operation(s, targetLink, operationType = 'operation') {
  const name = `operation-${s.nextOperationId++}`;
  return {
    kind: 'compute#operation',
    id: String(900000000000 + s.nextOperationId),
    name,
    operationType,
    targetLink,
    status: 'DONE',
    progress: 100,
    insertTime: fixedNow,
    startTime: fixedNow,
    endTime: fixedNow,
  };
}

function findProject(s, idOrName) {
  const projectId = String(idOrName).replace(/^projects\//, '');
  return s.projects.find((project) => project.projectId === projectId || project.projectNumber === projectId);
}

function computeInstance(project, instance) {
  return {
    kind: 'compute#instance',
    id: instance.id,
    name: instance.name,
    zone: `https://www.googleapis.com/compute/v1/projects/${project.projectId}/zones/${instance.zone}`,
    machineType: `https://www.googleapis.com/compute/v1/projects/${project.projectId}/zones/${instance.zone}/machineTypes/${instance.machineType}`,
    status: instance.status,
    creationTimestamp: instance.creationTimestamp,
    networkInterfaces: instance.networkInterfaces,
  };
}

export const contract = {
  provider: 'gcp',
  source: 'Google Cloud Resource Manager, Compute Engine, and Service Usage REST references plus gcloud CLI installation guidance',
  docs: 'https://docs.cloud.google.com/sdk/docs/install-sdk',
  baseUrls: ['https://cloudresourcemanager.googleapis.com', 'https://compute.googleapis.com', 'https://serviceusage.googleapis.com'],
  auth: 'Bearer token or gcloud application-default credentials',
  scope: ['cloudresourcemanager.projects', 'compute.zones', 'compute.instances', 'serviceusage.services'],
  fidelity: 'stateful-gcloud-core-rest-emulator',
};

export const plugin = {
  name: 'gcp',
  register(app, store) {
    app.get('/v1/projects', (c) => {
      const projects = state(store).projects.filter((project) => project.lifecycleState !== 'DELETE_REQUESTED');
      return c.json({ projects });
    });
    app.post('/v1/projects', async (c) => createProject(c, store, 'v1'));
    app.get('/v1/projects/:projectId', (c) => getProject(c, store, 'v1'));
    app.delete('/v1/projects/:projectId', (c) => deleteProject(c, store));

    app.get('/v3/projects', (c) => {
      const projects = state(store).projects.filter((project) => project.lifecycleState !== 'DELETE_REQUESTED').map(projectResource);
      return c.json({ projects });
    });
    app.post('/v3/projects', async (c) => createProject(c, store, 'v3'));
    app.get('/v3/projects/:projectId', (c) => getProject(c, store, 'v3'));
    app.delete('/v3/projects/:projectId', (c) => deleteProject(c, store));

    app.get('/compute/v1/projects/:projectId/zones', (c) => {
      const s = state(store);
      const project = findProject(s, c.req.param('projectId'));
      if (!project) return gcpError(c, 404, 'NOT_FOUND', 'The project was not found.');
      return c.json({ kind: 'compute#zoneList', id: `projects/${project.projectId}/zones`, items: s.zones.map((zone) => ({ kind: 'compute#zone', id: zone.name, name: zone.name, region: `https://www.googleapis.com/compute/v1/projects/${project.projectId}/regions/${zone.region}`, status: zone.status })) });
    });
    app.get('/compute/v1/projects/:projectId/zones/:zone/instances', (c) => listInstances(c, store));
    app.post('/compute/v1/projects/:projectId/zones/:zone/instances', async (c) => createInstance(c, store));
    app.get('/compute/v1/projects/:projectId/zones/:zone/instances/:instance', (c) => getInstance(c, store));

    app.get('/v1/projects/:projectId/services', (c) => {
      const s = state(store);
      const project = findProject(s, c.req.param('projectId'));
      if (!project) return gcpError(c, 404, 'NOT_FOUND', 'The project was not found.');
      const prefix = `projects/${project.projectId}/services/`;
      return c.json({ services: s.services.filter((service) => service.name.startsWith(prefix)) });
    });
    app.get('/v1/projects/:projectId/services/:serviceName', (c) => {
      const service = state(store).services.find((item) => item.name === `projects/${c.req.param('projectId')}/services/${c.req.param('serviceName')}`);
      if (!service) return gcpError(c, 404, 'NOT_FOUND', 'The service was not found.');
      return c.json(service);
    });

    app.get('/gcp/inspect/state', (c) => c.json(state(store)));
  },
};

async function createProject(c, store, version) {
  const s = state(store);
  const body = await c.req.json().catch(() => ({}));
  const projectId = body.projectId ?? body.project_id ?? body.name?.replace(/^projects\//, '') ?? `emulator-project-${s.projects.length + 1}`;
  if (findProject(s, projectId)) return gcpError(c, 409, 'ALREADY_EXISTS', 'Requested entity already exists.');
  const project = {
    projectId,
    projectNumber: String(s.nextProjectNumber++),
    name: body.name && !body.name.startsWith('projects/') ? body.name : body.displayName ?? projectId,
    lifecycleState: 'ACTIVE',
    labels: body.labels ?? {},
    createTime: fixedNow,
    parent: body.parent && typeof body.parent === 'object' ? body.parent : undefined,
  };
  s.projects.push(project);
  s.services.push({ name: `projects/${project.projectId}/services/cloudresourcemanager.googleapis.com`, config: { name: 'cloudresourcemanager.googleapis.com', title: 'Cloud Resource Manager API' }, state: 'ENABLED' });
  save(store, s);
  if (version === 'v3') return c.json({ name: `operations/project-${project.projectNumber}`, done: true, response: projectResource(project) }, 200);
  return c.json(project, 200);
}

function getProject(c, store, version) {
  const project = findProject(state(store), c.req.param('projectId'));
  if (!project || project.lifecycleState === 'DELETE_REQUESTED') return gcpError(c, 404, 'NOT_FOUND', 'The project was not found.');
  return c.json(version === 'v3' ? projectResource(project) : project);
}

function deleteProject(c, store) {
  const s = state(store);
  const project = findProject(s, c.req.param('projectId'));
  if (!project) return gcpError(c, 404, 'NOT_FOUND', 'The project was not found.');
  project.lifecycleState = 'DELETE_REQUESTED';
  save(store, s);
  return c.json({ name: `operations/delete-${project.projectNumber}`, done: true, response: {} });
}

function listInstances(c, store) {
  const s = state(store);
  const project = findProject(s, c.req.param('projectId'));
  if (!project) return gcpError(c, 404, 'NOT_FOUND', 'The project was not found.');
  const zone = c.req.param('zone');
  const items = s.instances.filter((instance) => instance.zone === zone).map((instance) => computeInstance(project, instance));
  return c.json({ kind: 'compute#instanceList', id: `projects/${project.projectId}/zones/${zone}/instances`, items });
}

async function createInstance(c, store) {
  const s = state(store);
  const project = findProject(s, c.req.param('projectId'));
  if (!project) return gcpError(c, 404, 'NOT_FOUND', 'The project was not found.');
  const body = await c.req.json().catch(() => ({}));
  const instance = {
    id: String(s.nextInstanceId++),
    name: body.name ?? `emulator-vm-${s.instances.length + 1}`,
    zone: c.req.param('zone'),
    machineType: String(body.machineType ?? 'e2-micro').split('/').at(-1),
    status: 'RUNNING',
    creationTimestamp: fixedNow,
    networkInterfaces: body.networkInterfaces ?? [{ name: 'nic0', networkIP: `10.128.0.${s.instances.length + 2}`, accessConfigs: [] }],
  };
  s.instances.push(instance);
  const op = operation(s, `projects/${project.projectId}/zones/${instance.zone}/instances/${instance.name}`, 'insert');
  save(store, s);
  return c.json(op);
}

function getInstance(c, store) {
  const s = state(store);
  const project = findProject(s, c.req.param('projectId'));
  if (!project) return gcpError(c, 404, 'NOT_FOUND', 'The project was not found.');
  const instance = s.instances.find((item) => item.zone === c.req.param('zone') && item.name === c.req.param('instance'));
  if (!instance) return gcpError(c, 404, 'NOT_FOUND', 'The resource was not found.');
  return c.json(computeInstance(project, instance));
}

export function seedFromConfig(store, _baseUrl, config = {}) {
  return save(store, { ...defaultState(), ...config });
}

export const label = 'Google Cloud Platform API emulator';
export const endpoints = 'Cloud Resource Manager projects, Compute Engine zones/instances, and Service Usage services';
export const capabilities = contract.scope;
export const initConfig = { gcp: { projectId: defaultState().projects[0].projectId } };
export default plugin;
