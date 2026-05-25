import { fixedNow, getState, readBody, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'alibaba-cloud:state';
const REQUEST_ID = '7F4B6E64-EMULATOR-4F3C-9E2E-000000000001';
const PARAM_NAMES = ['Action', 'Version', 'Format', 'RegionId', 'ZoneId', 'VpcId', 'InstanceId', 'InstanceIds', 'InstanceName', 'Description', 'InstanceType', 'ImageId', 'PageNumber', 'PageSize'];

function defaultState() {
  return {
    accountId: '1234567890123456',
    regions: [
      { regionId: 'cn-hangzhou', localName: 'China (Hangzhou)', regionEndpoint: 'ecs.cn-hangzhou.aliyuncs.com' },
      { regionId: 'us-west-1', localName: 'US (Silicon Valley)', regionEndpoint: 'ecs.us-west-1.aliyuncs.com' },
    ],
    zones: [
      { zoneId: 'cn-hangzhou-h', regionId: 'cn-hangzhou', localName: 'Hangzhou Zone H' },
      { zoneId: 'us-west-1a', regionId: 'us-west-1', localName: 'Silicon Valley Zone A' },
    ],
    vpcs: [
      {
        vpcId: 'vpc-emulator001',
        regionId: 'cn-hangzhou',
        vpcName: 'emulator-vpc',
        cidrBlock: '172.16.0.0/12',
        status: 'Available',
        creationTime: fixedNow,
      },
    ],
    instances: [
      {
        instanceId: 'i-emulator001',
        instanceName: 'emulator-instance',
        description: 'Alibaba Cloud emulator ECS instance',
        regionId: 'cn-hangzhou',
        zoneId: 'cn-hangzhou-h',
        status: 'Running',
        instanceType: 'ecs.t6-c1m1.large',
        cpu: 2,
        memory: 2048,
        imageId: 'aliyun_3_x64_20G_alibase_20240528.vhd',
        vpcId: 'vpc-emulator001',
        privateIpAddress: '172.16.0.10',
        publicIpAddress: '203.0.113.10',
        creationTime: fixedNow,
      },
    ],
    nextInstance: 2,
  };
}

const state = (store) => getState(store, STATE_KEY, defaultState);
const save = (store, next) => setState(store, STATE_KEY, next);

function value(params, name) {
  return params[name] ?? params[name.toLowerCase()] ?? params[name.toUpperCase()];
}

function rpcError(c, code, message, status = 400) {
  return c.json({ RequestId: REQUEST_ID, HostId: c.req.header('host') ?? 'ecs.aliyuncs.com', Code: code, Message: message }, status);
}

function page(items, params) {
  const pageNumber = Math.max(1, Number(value(params, 'PageNumber') ?? 1));
  const pageSize = Math.max(1, Math.min(100, Number(value(params, 'PageSize') ?? 10)));
  const offset = (pageNumber - 1) * pageSize;
  return { pageNumber, pageSize, rows: items.slice(offset, offset + pageSize), totalCount: items.length };
}

function regionRows(s) {
  return s.regions.map((region) => ({
    RegionId: region.regionId,
    LocalName: region.localName,
    RegionEndpoint: region.regionEndpoint,
  }));
}

function zoneRows(s, regionId) {
  return s.zones
    .filter((zone) => !regionId || zone.regionId === regionId)
    .map((zone) => ({
      ZoneId: zone.zoneId,
      LocalName: zone.localName,
      AvailableResourceCreation: { ResourceTypes: ['Instance', 'Disk', 'VSwitch'] },
      AvailableInstanceTypes: { InstanceTypes: ['ecs.t6-c1m1.large', 'ecs.g6.large'] },
      AvailableDiskCategories: { DiskCategories: ['cloud_efficiency', 'cloud_essd'] },
    }));
}

function instanceRow(instance) {
  return {
    InstanceId: instance.instanceId,
    InstanceName: instance.instanceName,
    Description: instance.description,
    RegionId: instance.regionId,
    ZoneId: instance.zoneId,
    Status: instance.status,
    InstanceType: instance.instanceType,
    Cpu: instance.cpu,
    Memory: instance.memory,
    ImageId: instance.imageId,
    CreationTime: instance.creationTime,
    VpcAttributes: {
      VpcId: instance.vpcId,
      PrivateIpAddress: { IpAddress: [instance.privateIpAddress] },
    },
    PublicIpAddress: { IpAddress: [instance.publicIpAddress] },
  };
}

function vpcRow(vpc) {
  return {
    VpcId: vpc.vpcId,
    RegionId: vpc.regionId,
    VpcName: vpc.vpcName,
    CidrBlock: vpc.cidrBlock,
    Status: vpc.status,
    CreationTime: vpc.creationTime,
  };
}

async function paramsFrom(c) {
  const query = {};
  for (const name of PARAM_NAMES) {
    const found = c.req.query?.(name);
    if (found !== undefined) query[name] = found;
  }
  if (c.req.method === 'GET') return query;
  const body = await readBody(c).catch(() => ({}));
  return { ...query, ...body };
}

async function handleRpc(c, store) {
  const params = await paramsFrom(c);
  const action = value(params, 'Action');
  if (!action) return rpcError(c, 'MissingParameter', 'The input parameter "Action" that is mandatory for processing this request is not supplied.');

  const s = state(store);
  switch (action.toLowerCase()) {
    case 'describeregions':
      return c.json({ RequestId: REQUEST_ID, Regions: { Region: regionRows(s) } });
    case 'describezones': {
      const rows = zoneRows(s, value(params, 'RegionId'));
      return c.json({ RequestId: REQUEST_ID, Zones: { Zone: rows } });
    }
    case 'describevpcs': {
      const rows = s.vpcs.filter((vpc) => !value(params, 'RegionId') || vpc.regionId === value(params, 'RegionId')).map(vpcRow);
      const p = page(rows, params);
      return c.json({ RequestId: REQUEST_ID, PageNumber: p.pageNumber, PageSize: p.pageSize, TotalCount: p.totalCount, Vpcs: { Vpc: p.rows } });
    }
    case 'describeinstances': {
      const rows = s.instances
        .filter((instance) => !value(params, 'RegionId') || instance.regionId === value(params, 'RegionId'))
        .filter((instance) => !value(params, 'InstanceIds') || value(params, 'InstanceIds').includes(instance.instanceId))
        .map(instanceRow);
      const p = page(rows, params);
      return c.json({ RequestId: REQUEST_ID, PageNumber: p.pageNumber, PageSize: p.pageSize, TotalCount: p.totalCount, Instances: { Instance: p.rows } });
    }
    case 'startinstance':
    case 'stopinstance':
    case 'rebootinstance': {
      const instance = s.instances.find((item) => item.instanceId === value(params, 'InstanceId'));
      if (!instance) return rpcError(c, 'InvalidInstanceId.NotFound', 'The specified InstanceId does not exist.', 404);
      instance.status = action.toLowerCase() === 'stopinstance' ? 'Stopped' : 'Running';
      save(store, s);
      return c.json({ RequestId: REQUEST_ID });
    }
    case 'createinstance': {
      const regionId = value(params, 'RegionId') ?? 'cn-hangzhou';
      const zoneId = value(params, 'ZoneId') ?? s.zones.find((zone) => zone.regionId === regionId)?.zoneId ?? 'cn-hangzhou-h';
      const instanceId = `i-emulator${String(s.nextInstance++).padStart(3, '0')}`;
      const instance = {
        instanceId,
        instanceName: value(params, 'InstanceName') ?? instanceId,
        description: value(params, 'Description') ?? 'Alibaba Cloud emulator ECS instance',
        regionId,
        zoneId,
        status: 'Stopped',
        instanceType: value(params, 'InstanceType') ?? 'ecs.t6-c1m1.large',
        cpu: 2,
        memory: 2048,
        imageId: value(params, 'ImageId') ?? 'aliyun_3_x64_20G_alibase_20240528.vhd',
        vpcId: value(params, 'VpcId') ?? s.vpcs[0]?.vpcId ?? 'vpc-emulator001',
        privateIpAddress: `172.16.0.${10 + s.instances.length}`,
        publicIpAddress: `203.0.113.${10 + s.instances.length}`,
        creationTime: fixedNow,
      };
      s.instances.push(instance);
      save(store, s);
      return c.json({ RequestId: REQUEST_ID, InstanceId: instance.instanceId });
    }
    default:
      return rpcError(c, 'InvalidAction.NotFound', `Specified api is not found, please check your url and method. Action=${action}`, 404);
  }
}

export const contract = {
  provider: 'alibaba-cloud',
  source: 'Alibaba Cloud ECS OpenAPI reference and Alibaba Cloud CLI endpoint override documentation',
  docs: 'https://www.alibabacloud.com/help/en/ecs/developer-reference/api-describeinstances',
  baseUrl: 'https://ecs.{region}.aliyuncs.com',
  auth: 'AccessKey RPC signature parameters or bearer-style fake credentials accepted by local clients',
  scope: ['ecs.regions', 'ecs.zones', 'ecs.vpcs', 'ecs.instances'],
  fidelity: 'stateful-ecs-rpc-emulator',
};

export const plugin = {
  name: 'alibaba-cloud',
  register(app, store) {
    app.get('/', (c) => handleRpc(c, store));
    app.post('/', (c) => handleRpc(c, store));
    app.get('/ecs', (c) => handleRpc(c, store));
    app.post('/ecs', (c) => handleRpc(c, store));
    app.get('/alibaba-cloud/inspect/state', (c) => c.json(state(store)));
  },
};

export function seedFromConfig(store, _baseUrl, config = {}) {
  return save(store, { ...defaultState(), ...config });
}

export const label = 'Alibaba Cloud API emulator';
export const endpoints = 'ECS RPC DescribeRegions, DescribeZones, DescribeVpcs, DescribeInstances, and safe instance lifecycle actions';
export const capabilities = contract.scope;
export const initConfig = { 'alibaba-cloud': { regionId: defaultState().regions[0].regionId } };
export default plugin;
