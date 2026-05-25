import { runCloudProviderSmoke } from '../scripts/cloud-provider-smoke-kit.mjs';
import { contract, plugin } from './api-emulator.mjs';

await runCloudProviderSmoke({ slug: 'bunny', prefix: '/bunny', contract, plugin });
