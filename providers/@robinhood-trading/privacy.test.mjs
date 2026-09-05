import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

test('fixture generation never imports account state or arbitrary private capture fields', () => {
  const directory = mkdtempSync(join(tmpdir(), 'robinhood-privacy-'));
  try {
    const raw = join(directory, 'raw');
    mkdirSync(raw);
    const sentinel = 'PRIVATE_TEST_SENTINEL';
    for (const tool of ['get_accounts', 'get_portfolio', 'get_equity_positions', 'get_equity_orders', 'get_watchlists', 'get_equity_quotes']) {
      writeFileSync(join(raw, `${tool}.json`), JSON.stringify({ data: { accounts: [{ account_number: sentinel }], buying_power: '987654.32', total_value: '987654.32', watchlists: [{ name: sentinel, symbols: [sentinel] }], unknown_private_field: sentinel } }));
    }
    const output = join(directory, 'fixture.json');
    const script = fileURLToPath(new URL('./scripts/sanitize-fixtures.mjs', import.meta.url));
    const result = spawnSync(process.execPath, [script, raw, output], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const written = readFileSync(output, 'utf8');
    assert.ok(!written.includes(sentinel));
    assert.ok(!written.includes('987654.32'));
    assert.deepEqual(JSON.parse(written), JSON.parse(readFileSync(new URL('./fixtures/sanitized.json', import.meta.url))));
    rmSync(raw, { recursive: true });
    // Even a missing private input must have no effect on generation.
    assert.equal(spawnSync(process.execPath, [script, raw, output]).status, 0);
    assert.equal(readFileSync(output, 'utf8'), written);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
