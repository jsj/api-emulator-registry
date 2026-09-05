// Legacy command retained for compatibility. Private captures are never read.
// Regenerate only the explicitly synthetic checked-in fixture.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = new URL('../fixtures/sanitized.json', import.meta.url);
const output = resolve(process.argv[3] ?? fileURLToPath(source));
const fixture = JSON.parse(readFileSync(source, 'utf8'));
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(fixture, null, 2)}\n`);
console.log('Wrote synthetic fixture; private capture input is intentionally ignored.');
