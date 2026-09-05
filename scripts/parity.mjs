import { mkdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { evaluateParity } from './parity/run.mjs';
import { compareToolContracts } from './parity/compare.mjs';

// Add providers here only when they have independent reference captures.
const providers = { 'robinhood-trading': '../providers/@robinhood-trading/parity.mjs' };
const args = process.argv.slice(2);
const provider = args.find(arg => !arg.startsWith('--')) ?? 'robinhood-trading';
if (!providers[provider] || args.filter(arg => !arg.startsWith('--')).length > 1 || args.some(arg => arg.startsWith('--') && !['--json', '--live-contract', '--strict'].includes(arg))) {
  throw new Error('Usage: node scripts/parity.mjs [robinhood-trading] [--json] [--live-contract] [--strict]');
}
const adapter = await (await import(providers[provider])).loadParity();
const report = {
  provider, checked_at: new Date().toISOString(),
  behavior_captured_at: adapter.fixture.captured_at,
  contract_captured_at: adapter.contract.captured_at,
  scope: adapter.fixture.scope,
  live_contract: { status: 'not_checked' },
  ...await evaluateParity(adapter),
};
if (args.includes('--live-contract')) {
  // tools/list only; this command never invokes live tools/call.
  const result = spawnSync('npx', ['-y', 'mcporter@0.13.7', 'list', '--http-url', adapter.contract.source, '--schema', '--json', '--no-oauth'], { encoding: 'utf8', timeout: 90000, maxBuffer: 16 * 1024 * 1024 });
  try {
    if (result.status !== 0 || result.error) throw new Error('Live tools/list failed');
    const clean = result.stdout.replace(/\u001b\[[0-9;]*[A-Za-z]/g, '').trim();
    const payload = JSON.parse(clean.slice(clean.indexOf('{'), clean.lastIndexOf('}') + 1));
    if (payload.status !== 'ok' || !Array.isArray(payload.tools)) throw new Error('Live tools/list unavailable; check local mcporter authentication');
    const differences = compareToolContracts(adapter.expectedTools, payload.tools);
    const drift = Object.values(differences).some(rows => rows.length);
    report.live_contract = { status: drift ? 'drift' : 'passed', checked_at: new Date().toISOString(), ...differences };
    if (drift) report.passed = report.boundedParity = false;
  } catch (error) {
    report.live_contract = { status: 'error', message: error.message };
    report.passed = report.boundedParity = false;
  }
}
if (args.includes('--strict') && !report.boundedParity) report.passed = false;
const output = new URL(`../.emu/parity/${provider}.json`, import.meta.url);
await mkdir(new URL('.', output), { recursive: true });
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
if (args.includes('--json')) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`${provider}: ${report.passed ? 'PASS' : 'FAIL'} regression check; ${report.scenarios.filter(row => row.status === 'passed').length}/${report.scenarios.length} scenarios match; ${report.scenarios.filter(row => row.status === 'known_gap').length} known gaps`);
  console.log(`Operations: ${JSON.stringify(report.counts)}`);
  console.log(`Live behavior capture: ${report.behavior_captured_at}; live contract: ${report.live_contract.status}`);
  for (const scenario of report.scenarios.filter(row => row.status !== 'passed')) console.log(`${scenario.id}: ${scenario.status}; ${scenario.gapReason ?? scenario.differences.map(diff => `${diff.kind} ${diff.path}`).join(', ')}`);
  console.log(`Report: ${output.pathname}`);
}
if (!report.passed) process.exitCode = 1;
