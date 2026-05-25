import { createCloudProvider } from '../scripts/cloud-provider-emulator-kit.mjs';

const emulator = createCloudProvider({
  slug: 'leaseweb',
  label: 'Leaseweb',
  source: 'Leaseweb public cloud, dedicated server, network, and CDN API references',
  docs: 'https://developer.leaseweb.com/',
  baseUrl: 'https://api.leaseweb.com',
  prefix: '/leaseweb',
  regions: [{ id: 'ams-01', name: 'Amsterdam' }, { id: 'fra-10', name: 'Frankfurt' }, { id: 'wdc-01', name: 'Washington DC' }],
  serverPrefix: 'lsw_server',
  networkPrefix: 'lsw_network',
  defaultPlan: 'lsw.m3.small',
});

export const { contract, plugin, seedFromConfig, label, endpoints, capabilities, initConfig } = emulator;
export default plugin;
