import { createCloudProvider } from '../scripts/cloud-provider-emulator-kit.mjs';

const emulator = createCloudProvider({
  slug: 'hostinger',
  label: 'Hostinger',
  source: 'Hostinger API reference for VPS, DNS, domains, and account workflows',
  docs: 'https://developers.hostinger.com/',
  baseUrl: 'https://developers.hostinger.com/api',
  prefix: '/hostinger/api',
  regions: [{ id: 'eu-central', name: 'Europe' }, { id: 'us-east', name: 'United States' }, { id: 'asia-south', name: 'Asia' }],
  serverPrefix: 'vps',
  networkPrefix: 'hostinger_network',
  defaultPlan: 'KVM 1',
});

export const { contract, plugin, seedFromConfig, label, endpoints, capabilities, initConfig } = emulator;
export default plugin;
