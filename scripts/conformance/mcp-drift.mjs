import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { rootPath } from './load.mjs';

function cleanJson(output) {
  const clean = output.replaceAll('\r', '').replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error('mcporter output did not contain JSON');
  return JSON.parse(clean.slice(start, end + 1));
}

function normalized(value) {
  if (Array.isArray(value)) return value.map(normalized);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, normalized(item)]));
}

function projectTools(tools, compare) {
  return tools
    .map((tool) => compare === 'names'
      ? { name: tool.name }
      : {
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          ...(tool.outputSchema === undefined ? {} : { outputSchema: tool.outputSchema }),
        })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function sameContract(actual, expected) {
  return JSON.stringify(normalized(actual)) === JSON.stringify(normalized(expected));
}

function listLiveTools(url) {
  const result = spawnSync(
    'npx',
    ['-y', 'mcporter', 'list', url, '--schema', '--json'],
    { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 },
  );
  if (result.error) throw result.error;
  try {
    return cleanJson(result.stdout);
  } catch (error) {
    const detail = result.stderr.trim();
    throw new Error(`mcporter exited with ${result.status}: ${detail || error.message}`);
  }
}

export async function analyzeMcpDrift({ strictAuth = false, offline = false } = {}) {
  const providers = JSON.parse(await readFile(rootPath('conformance/mcp-providers.json'), 'utf8'));
  const reports = [];

  for (const provider of providers) {
    if (offline) {
      reports.push({ provider: provider.provider, status: 'skipped', message: 'live MCP checks disabled by --offline' });
      continue;
    }

    let payload;
    try {
      payload = listLiveTools(provider.url);
    } catch (error) {
      reports.push({ provider: provider.provider, status: 'error', message: error.message });
      continue;
    }

    if (payload.status === 'auth' || payload.issue?.kind === 'auth') {
      reports.push({
        provider: provider.provider,
        status: strictAuth ? 'error' : 'skipped',
        message: strictAuth ? 'authentication required (--strict-auth)' : 'authentication required',
      });
      continue;
    }

    const allowed = provider.allowedIssue;
    if (allowed && payload.issue?.kind === allowed.kind && payload.issue?.statusCode === allowed.statusCode) {
      reports.push({ provider: provider.provider, status: 'degraded', message: `${allowed.reason} (${allowed.statusCode})` });
      continue;
    }

    if (payload.status !== 'ok' || !Array.isArray(payload.tools)) {
      const detail = payload.error ?? payload.issue?.rawMessage ?? `unexpected status ${payload.status ?? 'unknown'}`;
      reports.push({ provider: provider.provider, status: 'error', message: detail });
      continue;
    }

    const fixture = JSON.parse(await readFile(rootPath(provider.fixture), 'utf8'));
    const actual = projectTools(payload.tools, provider.compare);
    const expected = projectTools(fixture.tools, provider.compare);
    if (!sameContract(actual, expected)) {
      const actualNames = new Set(actual.map((tool) => tool.name));
      const expectedNames = new Set(expected.map((tool) => tool.name));
      const added = [...actualNames].filter((name) => !expectedNames.has(name));
      const removed = [...expectedNames].filter((name) => !actualNames.has(name));
      const nameDelta = [added.length ? `added: ${added.join(', ')}` : '', removed.length ? `removed: ${removed.join(', ')}` : ''].filter(Boolean).join('; ');
      reports.push({ provider: provider.provider, status: 'drift', message: nameDelta || 'tool schemas changed' });
      continue;
    }

    reports.push({ provider: provider.provider, status: 'ok', message: `${actual.length} tools match` });
  }

  return reports;
}
