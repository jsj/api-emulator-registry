import { createCloudProvider } from '../scripts/cloud-provider-emulator-kit.mjs';

const emulator = createCloudProvider({
  slug: 'akamai',
  label: 'Akamai',
  source: 'Akamai EdgeGrid APIs and Akamai Cloud Computing Services API references',
  docs: 'https://techdocs.akamai.com/developer/docs/apis',
  baseUrl: 'https://{account}.luna.akamaiapis.net',
  auth: 'Akamai EdgeGrid signature or local bearer token',
  prefix: '/akamai',
  regions: [{ id: 'us-east', name: 'US East' }, { id: 'eu-central', name: 'EU Central' }],
  serverPrefix: 'linode',
  networkPrefix: 'vpc',
  cdnPrefix: 'property',
});

export const { contract, plugin, seedFromConfig, label, endpoints, capabilities, initConfig } = emulator;
export default plugin;
