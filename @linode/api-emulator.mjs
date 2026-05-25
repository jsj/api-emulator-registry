import { createCloudProvider } from '../scripts/cloud-provider-emulator-kit.mjs';

const emulator = createCloudProvider({
  slug: 'linode',
  label: 'Linode',
  source: 'Linode API v4 reference for account, regions, instances, VPCs, and node balancers',
  docs: 'https://techdocs.akamai.com/linode-api/reference/api',
  baseUrl: 'https://api.linode.com/v4',
  prefix: '/linode/v4',
  regions: [{ id: 'us-east', name: 'Newark, NJ' }, { id: 'de-fra-2', name: 'Frankfurt' }, { id: 'gb-lon', name: 'London' }],
  serverPrefix: 'linode',
  networkPrefix: 'vpc',
  defaultPlan: 'g6-nanode-1',
});

export const { contract, plugin, seedFromConfig, label, endpoints, capabilities, initConfig } = emulator;
export default plugin;
