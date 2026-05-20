import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';

import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);

const contract = await harness.call('GET', '/anotes/inspect/contract');
assert.equal(contract.status, 200);
assert.equal(contract.payload.provider, 'anotes');

const status = await harness.call('GET', '/anotes/status');
assert.equal(status.status, 200);
assert.equal(status.payload.ok, true);
assert.equal(status.payload.note_count, 2);

const folders = await harness.call('GET', '/anotes/folders');
assert.equal(folders.status, 200);
assert.equal(folders.payload[0].name, 'Inbox');

const notes = await harness.call('GET', '/anotes/notes');
assert.equal(notes.status, 200);
assert.equal(notes.payload[0].title, 'Welcome to anotes');
assert.equal(notes.payload[0].body, 'Seed Apple Notes content from the emulator.');

const note = await harness.call('GET', '/anotes/notes/100');
assert.equal(note.status, 200);
assert.equal(note.payload.folder_name, 'Inbox');
assert.equal(note.payload.body, 'Seed Apple Notes content from the emulator.');

const search = await harness.call('GET', '/anotes/search?query=checklist');
assert.equal(search.status, 200);
assert.equal(search.payload[0].title, 'Project checklist');

const created = await harness.call('POST', '/anotes/notes', {
  title: 'Created via fakout',
  body: 'Created note body',
  folder_id: 10,
});
assert.equal(created.status, 201);
assert.equal(created.payload.title, 'Created via fakout');

const rpcList = await harness.call('POST', '/anotes/rpc', {
  jsonrpc: '2.0',
  id: 1,
  method: 'notes.list',
});
assert.equal(rpcList.status, 200);
assert.equal(rpcList.payload.id, 1);
assert.equal(rpcList.payload.result.length, 3);

const rpcCreate = await harness.call('POST', '/anotes/rpc', {
  jsonrpc: '2.0',
  id: 2,
  method: 'notes.create',
  params: { title: 'RPC note', body: 'rpc body' },
});
assert.equal(rpcCreate.status, 200);
assert.equal(rpcCreate.payload.result.title, 'RPC note');

const fixture = await harness.call('GET', '/anotes/fixtures/note-store.sql');
assert.equal(fixture.status, 200);
assert.match(fixture.payload, /Welcome to anotes/);
assert.match(fixture.payload, /ZICCLOUDSYNCINGOBJECT/);

const db = new DatabaseSync(':memory:');
try {
  db.exec(fixture.payload);
  const count = db.prepare('select count(*) as count from ZICCLOUDSYNCINGOBJECT where Z_ENT = 12;').get();
  assert.equal(count.count, 4);
  const body = db.prepare('select cast(ZDATA as text) as body from ZICNOTEDATA where ZNOTE = 100;').get();
  assert.equal(body.body, 'Seed Apple Notes content from the emulator.');
} finally {
  db.close();
}

console.log('anotes smoke ok');
