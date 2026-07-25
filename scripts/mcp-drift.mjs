import { analyzeMcpDrift } from './conformance/mcp-drift.mjs';

const json = process.argv.includes('--json');
const reports = await analyzeMcpDrift({
  strictAuth: process.argv.includes('--strict-auth'),
  offline: process.argv.includes('--offline'),
});

if (json) {
  console.log(JSON.stringify({ mcp: reports }, null, 2));
} else {
  for (const report of reports) console.log(`${report.provider}: ${report.status}: ${report.message}`);
}

if (reports.some((report) => ['error', 'drift'].includes(report.status))) process.exit(1);
