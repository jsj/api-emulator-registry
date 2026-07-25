import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
assert.equal(contract.provider, 'mobbin');

const metadata = await harness.call('GET', '/.well-known/oauth-protected-resource/mcp');
assert.equal(metadata.payload.resource, 'https://api.mobbin.com/mcp');
assert.equal(metadata.payload.scopes_supported[0], 'openid');

const restSearch = await harness.call('POST', '/v1/screens/search', {
  query: 'dashboard analytics',
  platform: 'web',
  mode: 'deep',
  limit: 2,
});
assert.equal(restSearch.status, 200);
assert.equal(restSearch.payload.screens[0].app_name, 'Ghost');
assert.equal(restSearch.payload.screens[0].platform, 'web');

const init = await harness.call('POST', '/mcp', {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'smoke', version: '0.0.0' },
  },
});
assert.equal(init.payload.result.serverInfo.name, 'mobbin-api-emulator');

const tools = await harness.call('POST', '/mcp', { jsonrpc: '2.0', id: 2, method: 'tools/list' });
assert.deepEqual(tools.payload.result.tools.map((tool) => tool.name), ['search_screens', 'search_flows', 'search_sections']);
assert.equal(tools.payload.result.tools[0].inputSchema.properties.platform.enum[0], 'ios');
assert.ok(tools.payload.result.tools.every((tool) => tool.outputSchema));

const toolCall = await harness.call('POST', '/mcp', {
  jsonrpc: '2.0',
  id: 3,
  method: 'tools/call',
  params: {
    name: 'search_screens',
    arguments: { query: 'retention cohorts', platform: 'web', limit: 5, image_format: 'jpg' },
  },
});
assert.equal(toolCall.payload.result.structuredContent.screens[0].app_name, 'June');
assert.match(toolCall.payload.result.content[0].text, /June/);

const flowCall = await harness.call('POST', '/mcp', {
  jsonrpc: '2.0',
  id: 4,
  method: 'tools/call',
  params: { name: 'search_flows', arguments: { query: 'personalized onboarding', platform: 'ios', limit: 3, page: 1 } },
});
assert.equal(flowCall.payload.result.structuredContent.flows[0].app_name, 'Duolingo');
assert.equal(flowCall.payload.result.structuredContent.flows[0].screen_count, 3);
assert.equal(flowCall.payload.result.structuredContent.has_next_page, false);

const sectionCall = await harness.call('POST', '/mcp', {
  jsonrpc: '2.0',
  id: 5,
  method: 'tools/call',
  params: { name: 'search_sections', arguments: { query: 'pricing comparison', limit: 5, page: 1 } },
});
assert.equal(sectionCall.payload.result.structuredContent.sections[0].site_name, 'Linear');
assert.equal(sectionCall.payload.result.structuredContent.page, 1);

const emptyResources = await harness.call('POST', '/mcp', { jsonrpc: '2.0', id: 6, method: 'resources/list' });
assert.deepEqual(emptyResources.payload.result.resources, []);

const invalid = await harness.call('POST', '/v1/screens/search', { query: 'anything', platform: 'android' });
assert.equal(invalid.status, 400);
assert.equal(invalid.payload.error.code, 'bad_request');

console.log('mobbin smoke ok');
