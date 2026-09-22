import { includesQuery, marketFromBody } from '../concepts/markets.mjs';
import { saveState, state } from '../store.mjs';
import { registerClobRoutes } from './clob.mjs';
import { registerOrderRoutes } from './orders.mjs';
import { registerDataRoutes } from './data.mjs';

function filteredMarkets(store, c) {
  const query = c.req.query?.('q') ?? c.req.query?.('query') ?? '';
  return Object.values(state(store).markets).filter(market => {
    if (!includesQuery(market, query)) return false;
    for (const field of ['active', 'closed', 'archived']) {
      const filter = c.req.query?.(field);
      if (filter !== undefined && String(market[field]) !== filter) return false;
    }
    const slug = c.req.query?.('slug');
    if (slug && market.slug !== slug) return false;
    return true;
  });
}

function page(c, items, keyset = false) {
  const limit = Number(c.req.query?.('limit') ?? 100);
  const cursor = c.req.query?.('after_cursor') ?? c.req.query?.('next_cursor') ?? c.req.query?.('cursor');
  const offset = Number(cursor ?? c.req.query?.('offset') ?? 0);
  if (!Number.isInteger(limit) || limit < 1 || limit > 500 || !Number.isInteger(offset) || offset < 0) return c.json({ error: 'Invalid pagination' }, 400);
  const rows = items.slice(offset, offset + limit);
  return c.json(keyset ? { markets: rows, ...(offset + limit < items.length ? { next_cursor: String(offset + limit) } : {}) } : rows);
}

function event(market) {
  return { id: `event-${market.id}`, slug: market.slug, title: market.question,
    active: market.active, closed: market.closed, markets: [market] };
}

export function registerRoutes(app, store) {
  // Preserve legacy unprefixed Gamma routes and expose distinct API roots.
  const gamma = { get(path, handler) { app.get(path, handler); app.get(`/gamma${path}`, handler); } };
  gamma.get('/markets', (c) => {
    const current = state(store);
    const query = c.req.query?.('q') ?? c.req.query?.('query') ?? '';
    const limit = Math.max(0, Number(c.req.query?.('limit') ?? 100));
    current.requests.push({ endpoint: '/markets', query, limit, requestedAt: new Date().toISOString() });
    saveState(store, current);
    return page(c, filteredMarkets(store, c));
  });

  gamma.get('/markets/keyset', c => page(c, filteredMarkets(store, c), true));
  gamma.get('/markets/slug/:slug', c => {
    const market = Object.values(state(store).markets).find(m => m.slug === c.req.param('slug'));
    return market ? c.json(market) : c.json({ error: 'Market not found' }, 404);
  });
  gamma.get('/events', c => page(c, filteredMarkets(store, c).map(event)));
  for (const path of ['/events/:id', '/events/slug/:slug']) gamma.get(path, c => {
    const result = Object.values(state(store).markets).map(event).find(e => c.req.param('slug') ? e.slug === c.req.param('slug') : e.id === c.req.param('id'));
    return result ? c.json(result) : c.json({ error: 'Event not found' }, 404);
  });
  gamma.get('/public-search', c => {
    if (!c.req.query?.('q')?.trim()) return c.json({ error: 'Query is required' }, 400);
    const events = filteredMarkets(store, c).map(event);
    const limit = Number(c.req.query?.('limit_per_type') ?? 10);
    const number = Number(c.req.query?.('page') ?? 1);
    if (!Number.isInteger(limit) || limit < 1 || !Number.isInteger(number) || number < 1) return c.json({ error: 'Invalid pagination' }, 400);
    return c.json({ events: events.slice((number - 1) * limit, number * limit), tags: [], profiles: [], pagination: { hasMore: number * limit < events.length, totalResults: events.length } });
  });

  gamma.get('/markets/:id', (c) => {
    const current = state(store);
    const id = c.req.param('id');
    const market = current.markets[id];
    current.requests.push({ endpoint: `/markets/${id}`, requestedAt: new Date().toISOString() });
    saveState(store, current);
    if (!market) return c.json({ error: 'Market not found' }, 404);
    return c.json(market);
  });

  app.post('/control/markets', async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body || typeof body !== 'object' || Array.isArray(body)) return c.json({ error: 'Expected a market object' }, 400);
    const market = marketFromBody(body);
    const current = state(store);
    current.markets[market.id] = market;
    saveState(store, current);
    return c.json(market, 201);
  });

  app.get('/inspect/markets', (c) => c.json(Object.values(state(store).markets)));
  app.get('/inspect/requests', (c) => c.json(state(store).requests));
  registerClobRoutes(app, store);
  registerOrderRoutes(app, store);
  registerDataRoutes(app, store);
}
