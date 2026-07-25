import { analyzeConformance } from './conformance/drift.mjs';
import { loadConformance } from './conformance/load.mjs';
import { analyzeMcpDrift } from './conformance/mcp-drift.mjs';

const json = process.argv.includes('--json');
const conformance = await loadConformance();
const reports = await analyzeConformance(conformance);
const drift = reports.filter((report) => report.findings.length > 0);
const mcp = await analyzeMcpDrift({
  strictAuth: process.argv.includes('--strict-auth'),
  offline: process.argv.includes('--offline'),
});

if (json) {
  console.log(JSON.stringify({ drift, mcp }, null, 2));
} else if (drift.length === 0) {
  console.log('conformance drift ok');
} else {
  console.log(`conformance drift found (${drift.length} providers)`);
  for (const report of drift) {
    console.log(`\n${report.provider} (${report.score}%, ${report.scoreBand})`);
    for (const finding of report.findings) {
      console.log(`- ${finding.severity}: ${finding.area}: ${finding.message}`);
    }
  }
}

if (!json) {
  console.log('\nMCP live contract drift');
  for (const report of mcp) console.log(`- ${report.provider}: ${report.status}: ${report.message}`);
}

if (
  drift.some((report) => report.findings.some((finding) => finding.severity === 'error'))
  || mcp.some((report) => ['error', 'drift'].includes(report.status))
) {
  process.exit(1);
}
