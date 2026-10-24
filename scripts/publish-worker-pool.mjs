export async function runPool(items, limit, worker) {
  let index = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (index < items.length) {
      const item = items[index++];
      await worker(item);
    }
  });
  // Callers may delete shared workspaces after this returns or throws.
  const results = await Promise.allSettled(workers);
  const errors = results.filter((result) => result.status === 'rejected').map((result) => result.reason);
  if (errors.length > 0) throw new AggregateError(errors, 'Provider preparation failed');
}
