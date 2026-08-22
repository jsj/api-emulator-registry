import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const providerDir = dirname(dirname(fileURLToPath(import.meta.url)));
const outputPath = join(providerDir, 'fixtures', 'tools-contract.sanitized.json');
const mcpUrl = process.env.ROBINHOOD_MCP_TRADING_URL ?? 'https://agent.robinhood.com/mcp/trading';

const preflight = await fetch(mcpUrl, {
  method: 'POST',
  headers: {
    accept: 'application/json, text/event-stream',
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 'capture-preflight',
    method: 'initialize',
    params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'api-emulator-contract-capture', version: '1.0.0' } },
  }),
  redirect: 'manual',
});
if (![200, 401].includes(preflight.status)) {
  throw new Error(`Robinhood Streamable HTTP POST preflight returned ${preflight.status}; expected 200 or OAuth challenge 401`);
}

const command = ['-q', '/dev/null', 'npx', '-y', 'mcporter', 'list', '--http-url', mcpUrl, '--schema', '--json', '--no-oauth'];
const result = spawnSync('script', command, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, stdio: ['inherit', 'pipe', 'pipe'] });
if (result.status !== 0) {
  const detail = `${result.stdout}\n${result.stderr}`.trim();
  throw new Error(
    `live tools/list capture failed with ${result.status}: ${detail}\n`
    + `Refresh Robinhood OAuth with: npx -y mcporter auth ${mcpUrl} --reset`,
  );
}

const clean = result.stdout.replaceAll('\r', '').replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');
const start = clean.indexOf('{');
const end = clean.lastIndexOf('}');
if (start < 0 || end < start) throw new Error('live tools/list did not contain JSON');
const payload = JSON.parse(clean.slice(start, end + 1));
if (payload.status !== 'ok' || !Array.isArray(payload.tools)) throw new Error('live tools/list was not successful');

const sanitized = {
  captured_at: new Date().toISOString(),
  source: mcpUrl,
  tools: payload.tools.map(({ name, description, inputSchema, outputSchema }) => ({ name, description, inputSchema, outputSchema })),
};
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(sanitized, null, 2)}\n`);
console.log(`captured ${sanitized.tools.length} tools to ${outputPath}`);
