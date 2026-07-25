import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const providerDir = dirname(dirname(fileURLToPath(import.meta.url)));
const outputPath = join(providerDir, 'fixtures', 'tools-contract.sanitized.json');
const mcpUrl = process.env.MOBBIN_MCP_URL ?? 'https://api.mobbin.com/mcp';
const target = process.env.MOBBIN_MCP_URL ? mcpUrl : 'mobbin';

function parsePayload(output) {
  const clean = output.replaceAll('\r', '').replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  if (start < 0 || end < start) return null;
  return JSON.parse(clean.slice(start, end + 1));
}

let payload;
for (let attempt = 1; attempt <= 3; attempt += 1) {
  const result = spawnSync('npx', ['-y', 'mcporter', 'list', target, '--schema', '--json', '--timeout', '90000'], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  payload = parsePayload(result.stdout);
  if (payload?.status === 'ok' && Array.isArray(payload.tools)) break;
  if (attempt === 3) {
    const detail = payload?.error ?? payload?.issue?.rawMessage ?? result.stderr.trim() ?? `exit ${result.status}`;
    throw new Error(`live tools/list capture failed after ${attempt} attempts: ${detail}`);
  }
}

const sanitized = {
  captured_at: new Date().toISOString(),
  source: mcpUrl,
  tools: payload.tools.map(({ name, description, inputSchema, outputSchema }) => ({ name, description, inputSchema, outputSchema })),
};
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(sanitized, null, 2)}\n`);
console.log(`captured ${sanitized.tools.length} tools to ${outputPath}`);
