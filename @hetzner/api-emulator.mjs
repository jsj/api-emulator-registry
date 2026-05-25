import { createCloudProvider } from '../scripts/cloud-provider-emulator-kit.mjs';

const emulator = createCloudProvider({
  slug: 'hetzner',
  label: 'Hetzner Cloud',
  source: 'Hetzner Cloud API reference and hcloud CLI API surfaces',
  docs: 'https://docs.hetzner.cloud/',
  baseUrl: 'https://api.hetzner.cloud/v1',
  prefix: '/hetzner/v1',
  regions: [{ id: 'fsn1', name: 'Falkenstein' }, { id: 'nbg1', name: 'Nuremberg' }, { id: 'hel1', name: 'Helsinki' }],
  serverPrefix: 'hcloud_server',
  networkPrefix: 'hcloud_network',
  defaultPlan: 'cx22',
});

export const { contract, plugin, seedFromConfig, label, endpoints, capabilities, initConfig } = emulator;
export default plugin;
