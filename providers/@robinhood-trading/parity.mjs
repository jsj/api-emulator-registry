import { readFile } from 'node:fs/promises';
import { createHarness } from '../../scripts/provider-smoke-harness.mjs';
import { plugin, seedFromConfig } from './api-emulator.mjs';

export async function loadParity() {
  const fixture = JSON.parse(await readFile(new URL('./fixtures/parity.sanitized.json', import.meta.url), 'utf8'));
  const contract = JSON.parse(await readFile(new URL('./fixtures/tools-contract.sanitized.json', import.meta.url), 'utf8'));
  const knownGaps = JSON.parse(await readFile(new URL('./fixtures/parity-gaps.json', import.meta.url), 'utf8'));
  const harness = createHarness(plugin);
  seedFromConfig(harness.store, undefined, structuredClone(fixture.seed));
  const listed = await harness.call('POST', '/mcp/trading', { jsonrpc: '2.0', id: 1, method: 'tools/list' });
  return {
    fixture, contract, knownGaps,
    expectedTools: contract.tools,
    actualTools: listed.payload.result.tools,
    cases: fixture.cases,
    async runScenario(scenario) {
      // Every independent scenario starts with the same captured catalogue.
      seedFromConfig(harness.store, undefined, structuredClone(fixture.seed));
      const response = await harness.call('POST', '/mcp/trading', { jsonrpc: '2.0', id: scenario.id, method: 'tools/call', params: { name: scenario.tool, arguments: scenario.args } });
      if (response.status !== 200 || response.payload.error || response.payload.result?.isError) {
        return { parity_error: { status: response.status, payload: response.payload } };
      }
      return response.payload.result.structuredContent.data;
    },
  };
}
