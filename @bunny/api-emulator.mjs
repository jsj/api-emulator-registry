import { createCloudProvider } from '../scripts/cloud-provider-emulator-kit.mjs';

const emulator = createCloudProvider({
  slug: 'bunny',
  label: 'Bunny.net',
  source: 'Bunny.net API reference for CDN, storage zones, and edge services',
  docs: 'https://docs.bunny.net/reference',
  baseUrl: 'https://api.bunny.net',
  auth: 'AccessKey API header',
  prefix: '/bunny',
  regions: [{ id: 'de', name: 'Germany' }, { id: 'ny', name: 'New York' }],
  serverPrefix: 'bunny_compute',
  networkPrefix: 'bunny_net',
  cdnPrefix: 'pullzone',
});

export const { contract, plugin, seedFromConfig, label, endpoints, capabilities, initConfig } = emulator;
export default plugin;
