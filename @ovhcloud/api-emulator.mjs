import { createCloudProvider } from '../scripts/cloud-provider-emulator-kit.mjs';

const emulator = createCloudProvider({
  slug: 'ovhcloud',
  label: 'OVHcloud',
  source: 'OVHcloud API reference for cloud project, instance, network, and CDN workflows',
  docs: 'https://api.ovh.com/',
  baseUrl: 'https://eu.api.ovh.com/1.0',
  auth: 'OVH application key/signature headers or local bearer token',
  prefix: '/ovhcloud/1.0',
  regions: [{ id: 'GRA11', name: 'Gravelines' }, { id: 'SBG5', name: 'Strasbourg' }, { id: 'BHS5', name: 'Beauharnois' }],
  serverPrefix: 'ovh_instance',
  networkPrefix: 'vrack',
  defaultPlan: 'b2-7',
});

export const { contract, plugin, seedFromConfig, label, endpoints, capabilities, initConfig } = emulator;
export default plugin;
