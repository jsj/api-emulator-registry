// Shared scripts are bundled into provider artifacts. Select all packages when
// they change; the publisher's content hashes avoid unchanged publications.
export function selectChangedPackageProviders(catalog, files) {
  const sharedChange = files.some((file) =>
    file === 'api-emulator.catalog.json' || file === 'package.json' ||
    file.startsWith('scripts/') || /^(bun\.lockb?|package-lock\.json|pnpm-lock\.yaml)$/.test(file));
  return Object.entries(catalog)
    .filter(([, entry]) => entry.kind === 'package')
    .filter(([slug, entry]) => sharedChange || files.some((file) =>
      file.startsWith(`providers/@${slug}/`) || file === entry.specifier?.replace(/^\.\//, '')))
    .map(([slug]) => slug)
    .sort((a, b) => a.localeCompare(b));
}
