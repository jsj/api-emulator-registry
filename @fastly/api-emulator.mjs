import { createCloudProvider } from '../scripts/cloud-provider-emulator-kit.mjs';

const emulator = createCloudProvider({
  slug: 'fastly',
  label: 'Fastly',
  source: 'Fastly API reference and Fastly CLI service workflows',
  docs: 'https://www.fastly.com/documentation/reference/api/',
  baseUrl: 'https://api.fastly.com',
  prefix: '/fastly',
  regions: [{ id: 'global', name: 'Global Edge Network' }, { id: 'iad-va-us', name: 'Ashburn, Virginia' }],
  serverPrefix: 'fastly_server',
  networkPrefix: 'fastly_net',
  cdnPrefix: 'service',
});

export const { contract, plugin, seedFromConfig, label, endpoints, capabilities, initConfig } = emulator;
export default plugin;
