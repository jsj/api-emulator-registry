import { createCloudProvider } from '../scripts/cloud-provider-emulator-kit.mjs';

const emulator = createCloudProvider({
  slug: 'rackspace',
  label: 'Rackspace',
  source: 'Rackspace Cloud identity, servers, networks, and CDN/OpenStack-compatible API references',
  docs: 'https://docs.rackspace.com/docs/cloud-servers/v2',
  baseUrl: 'https://identity.api.rackspacecloud.com',
  auth: 'Rackspace auth token or local bearer token',
  prefix: '/rackspace',
  regions: [{ id: 'DFW', name: 'Dallas/Fort Worth' }, { id: 'ORD', name: 'Chicago' }, { id: 'LON', name: 'London' }],
  serverPrefix: 'rackspace_server',
  networkPrefix: 'rackspace_network',
  cdnPrefix: 'rackspace_cdn',
});

export const { contract, plugin, seedFromConfig, label, endpoints, capabilities, initConfig } = emulator;
export default plugin;
