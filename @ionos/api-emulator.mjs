import { createCloudProvider } from '../scripts/cloud-provider-emulator-kit.mjs';

const emulator = createCloudProvider({
  slug: 'ionos',
  label: 'IONOS Cloud',
  source: 'IONOS Cloud API references for datacenters, servers, LANs, and CDN-style edge services',
  docs: 'https://api.ionos.com/docs/cloud/v6/',
  baseUrl: 'https://api.ionos.com/cloudapi/v6',
  prefix: '/ionos/cloudapi/v6',
  regions: [{ id: 'de/fra', name: 'Frankfurt' }, { id: 'de/txl', name: 'Berlin' }, { id: 'gb/lhr', name: 'London' }],
  serverPrefix: 'ionos_server',
  networkPrefix: 'lan',
  defaultPlan: 'CUBES XS',
});

export const { contract, plugin, seedFromConfig, label, endpoints, capabilities, initConfig } = emulator;
export default plugin;
