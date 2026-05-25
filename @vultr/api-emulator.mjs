import { createCloudProvider } from '../scripts/cloud-provider-emulator-kit.mjs';

const emulator = createCloudProvider({
  slug: 'vultr',
  label: 'Vultr',
  source: 'Vultr API v2 reference for account, regions, instances, VPCs, and load-balancing workflows',
  docs: 'https://www.vultr.com/api/',
  baseUrl: 'https://api.vultr.com/v2',
  prefix: '/vultr/v2',
  regions: [{ id: 'ewr', name: 'New Jersey' }, { id: 'ams', name: 'Amsterdam' }, { id: 'fra', name: 'Frankfurt' }],
  serverPrefix: 'vultr_instance',
  networkPrefix: 'vpc',
  defaultPlan: 'vc2-1c-1gb',
});

export const { contract, plugin, seedFromConfig, label, endpoints, capabilities, initConfig } = emulator;
export default plugin;
