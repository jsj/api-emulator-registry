import { createCloudProvider } from '../scripts/cloud-provider-emulator-kit.mjs';

const emulator = createCloudProvider({
  slug: 'upcloud',
  label: 'UpCloud',
  source: 'UpCloud API reference for accounts, zones, servers, networks, and storage workflows',
  docs: 'https://developers.upcloud.com/1.3/',
  baseUrl: 'https://api.upcloud.com/1.3',
  auth: 'Basic auth or local bearer token',
  prefix: '/upcloud/1.3',
  regions: [{ id: 'fi-hel1', name: 'Helsinki' }, { id: 'de-fra1', name: 'Frankfurt' }, { id: 'uk-lon1', name: 'London' }],
  serverPrefix: 'upcloud_server',
  networkPrefix: 'upcloud_network',
  defaultPlan: '1xCPU-1GB',
});

export const { contract, plugin, seedFromConfig, label, endpoints, capabilities, initConfig } = emulator;
export default plugin;
