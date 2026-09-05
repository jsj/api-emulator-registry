const escapePointer = (segment) => String(segment).replaceAll('~', '~0').replaceAll('/', '~1');
const valueType = (value) => value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;

function parseIgnorePath(path) {
  if (typeof path !== 'string' || (path !== '' && !path.startsWith('/')) || /~(?![01])/.test(path)) {
    throw new TypeError(`Invalid JSON Pointer ignore path: ${path}`);
  }
  return path === '' ? [] : path.slice(1).split('/').map((segment) => segment.replaceAll('~1', '/').replaceAll('~0', '~'));
}

// Ignores match exact paths (with one-segment wildcards), and suppress only scalar changes.
// Missing fields, extra fields, array length, and types always remain visible.
export function compareJson(expected, actual, { ignorePaths = [] } = {}) {
  const patterns = ignorePaths.map(parseIgnorePath);
  const differences = [];
  function visit(left, right, segments) {
    const path = segments.map((segment) => `/${escapePointer(segment)}`).join('');
    const leftType = valueType(left);
    if (leftType !== valueType(right)) {
      differences.push({ path, kind: 'type', expected: left, actual: right });
    } else if (leftType === 'object' || leftType === 'array') {
      if (leftType === 'array' && left.length !== right.length) {
        differences.push({ path, kind: 'length', expected: left.length, actual: right.length });
      }
      const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])];
      keys.sort(leftType === 'array' ? (a, b) => Number(a) - Number(b) : undefined);
      for (const key of keys) {
        const childPath = `${path}/${escapePointer(key)}`;
        if (!Object.hasOwn(left, key)) differences.push({ path: childPath, kind: 'extra', actual: right[key] });
        else if (!Object.hasOwn(right, key)) differences.push({ path: childPath, kind: 'missing', expected: left[key] });
        else visit(left[key], right[key], [...segments, key]);
      }
    } else if (!Object.is(left, right) && !patterns.some((pattern) =>
      pattern.length === segments.length && pattern.every((segment, index) => segment === '*' || segment === segments[index]))) {
      differences.push({ path, kind: 'value', expected: left, actual: right });
    }
  }
  visit(expected, actual, []);
  return differences;
}

function indexTools(tools) {
  const indexed = new Map();
  for (const tool of tools) {
    if (typeof tool?.name !== 'string' || !tool.name) throw new TypeError('Tool must have a nonempty name');
    if (indexed.has(tool.name)) throw new Error(`Duplicate tool name: ${tool.name}`);
    indexed.set(tool.name, Object.fromEntries(['name', 'description', 'inputSchema', 'outputSchema']
      .filter((key) => Object.hasOwn(tool, key)).map((key) => [key, tool[key]])));
  }
  return indexed;
}

export function compareToolContracts(expectedTools, actualTools) {
  const expected = indexTools(expectedTools);
  const actual = indexTools(actualTools);
  const added = [...actual.keys()].filter((name) => !expected.has(name)).sort();
  const removed = [...expected.keys()].filter((name) => !actual.has(name)).sort();
  const changed = [...expected.keys()].filter((name) => actual.has(name)).sort().flatMap((name) => {
    const differences = compareJson(expected.get(name), actual.get(name));
    return differences.length ? [{ name, differences }] : [];
  });
  return { added, removed, changed };
}
