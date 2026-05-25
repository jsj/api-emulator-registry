import { runCloudProviderSmoke } from '../scripts/cloud-provider-smoke-kit.mjs';
import { contract, plugin } from './api-emulator.mjs';

await runCloudProviderSmoke({ slug: 'fastly', prefix: '/fastly', contract, plugin });
