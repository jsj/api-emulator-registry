import { createCloudProvider } from '../scripts/cloud-provider-emulator-kit.mjs';

const emulator = createCloudProvider({
  slug: 'scaleway',
  label: 'Scaleway',
  source: 'Scaleway REST APIs for account, zones, instances, private networks, and edge services',
  docs: 'https://www.scaleway.com/en/developers/api/',
  baseUrl: 'https://api.scaleway.com',
  prefix: '/scaleway',
  regions: [{ id: 'fr-par', name: 'Paris' }, { id: 'nl-ams', name: 'Amsterdam' }, { id: 'pl-waw', name: 'Warsaw' }],
  serverPrefix: 'scw_instance',
  networkPrefix: 'pn',
  defaultPlan: 'DEV1-S',
});

export const { contract, plugin, seedFromConfig, label, endpoints, capabilities, initConfig } = emulator;
export default plugin;
