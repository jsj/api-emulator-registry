import assert from 'node:assert/strict';
import { test } from 'node:test';
import { compareJson, compareToolContracts } from './compare.mjs';

test('compares JSON recursively with deterministic object order and exact scalars', () => {
  assert.deepEqual(compareJson({ b: [null, 1, true], a: 'x' }, { a: 'x', b: [null, 1, true] }), []);
  assert.deepEqual(compareJson({ z: 1, a: false }, { z: 2, a: true }), [
    { path: '/a', kind: 'value', expected: false, actual: true },
    { path: '/z', kind: 'value', expected: 1, actual: 2 },
  ]);
  assert.deepEqual(compareJson('1', 1), [{ path: '', kind: 'type', expected: '1', actual: 1 }]);
});

test('reports missing, extra and changed types, including null and arrays', () => {
  assert.deepEqual(compareJson({ a: 1, b: [], c: null }, { b: {}, c: false, d: 2 }), [
    { path: '/a', kind: 'missing', expected: 1 },
    { path: '/b', kind: 'type', expected: [], actual: {} },
    { path: '/c', kind: 'type', expected: null, actual: false },
    { path: '/d', kind: 'extra', actual: 2 },
  ]);
});

test('array order and length are significant', () => {
  assert.deepEqual(compareJson([1, 2], [2, 1]).map((d) => d.path), ['/0', '/1']);
  assert.deepEqual(compareJson([1], [1, 2]), [
    { path: '', kind: 'length', expected: 1, actual: 2 },
    { path: '/1', kind: 'extra', actual: 2 },
  ]);
});

test('explicit wildcard ignores work on arrays and objects without automatic ID dropping', () => {
  const expected = { rows: [{ id: 'a' }, { id: 'b' }], map: { first: { time: 1 } }, id: 'old' };
  const actual = { rows: [{ id: 'c' }, { id: 'd' }], map: { first: { time: 2 } }, id: 'new' };
  assert.deepEqual(compareJson(expected, actual, { ignorePaths: ['/rows/*/id', '/map/*/time'] }), [
    { path: '/id', kind: 'value', expected: 'old', actual: 'new' },
  ]);
});

test('ignores cannot hide structure or type drift', () => {
  const options = { ignorePaths: ['/*', '/rows/*', '/rows/*/*'] };
  const expected = { missing: 1, type: 1, rows: [{ id: 'old' }] };
  const actual = { extra: 1, type: '1', rows: [{ other: 'new' }, null] };
  assert.deepEqual(compareJson(expected, actual, options), compareJson(expected, actual));
  assert.equal(compareJson([1], [2, 3], { ignorePaths: ['/*'] })[0].kind, 'length');
});

test('escapes JSON Pointer fields and validates ignore paths', () => {
  const expected = { 'a/b': { '~key': 1, '': 2 } };
  const actual = { 'a/b': { '~key': 2, '': 3 } };
  assert.deepEqual(compareJson(expected, actual).map((d) => d.path), ['/a~1b/', '/a~1b/~0key']);
  assert.deepEqual(compareJson(expected, actual, { ignorePaths: ['/a~1b/~0key', '/a~1b/'] }), []);
  assert.deepEqual(compareJson(1, 2, { ignorePaths: [''] }), []);
  for (const path of ['id', '/bad~2', null]) assert.throws(() => compareJson({}, {}, { ignorePaths: [path] }), /Invalid JSON Pointer/);
});

test('tool order and unrelated metadata do not change normalized contracts', () => {
  const tools = [{ name: 'b', description: 'B', inputSchema: { type: 'object' } }, { name: 'a' }];
  assert.deepEqual(compareToolContracts(tools, [{ name: 'a', annotations: {} }, tools[0]]), { added: [], removed: [], changed: [] });
});

test('reports added and removed tools and description, input and output schema drift', () => {
  const expected = [{ name: 'removed' }, { name: 'same', description: 'old', inputSchema: { type: 'object' } }];
  const actual = [{ name: 'added' }, { name: 'same', description: 'new', inputSchema: { type: 'string' }, outputSchema: {} }];
  const result = compareToolContracts(expected, actual);
  assert.deepEqual(result.added, ['added']);
  assert.deepEqual(result.removed, ['removed']);
  assert.equal(result.changed[0].name, 'same');
  assert.deepEqual(result.changed[0].differences.map((d) => [d.path, d.kind]), [
    ['/description', 'value'], ['/inputSchema/type', 'value'], ['/outputSchema', 'extra'],
  ]);
});

test('duplicate tool names are rejected in either contract', () => {
  const duplicate = [{ name: 'a' }, { name: 'a' }];
  assert.throws(() => compareToolContracts(duplicate, []), /Duplicate tool name: a/);
  assert.throws(() => compareToolContracts([], duplicate), /Duplicate tool name: a/);
});
