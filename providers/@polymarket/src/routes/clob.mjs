import { createHash } from 'node:crypto';
import { FIXTURE_TIME, state } from '../store.mjs';

export function findToken(store, tokenId) {
  for (const market of Object.values(state(store).markets)) {
    const index = JSON.parse(market.clobTokenIds ?? '[]').indexOf(tokenId);
    if (index !== -1) return { market, index, price: Number(JSON.parse(market.outcomePrices)[index]) };
  }
}

export function orderBook(store, tokenId) {
  const token = findToken(store, tokenId);
  if (!token) return null;
  const { market, price } = token;
  const book = {
    market: market.conditionId, asset_id: tokenId, timestamp: String(FIXTURE_TIME * 1000),
    bids: [{ price: Math.max(0.01, price - 0.01).toFixed(2), size: '100' }],
    asks: [{ price: Math.min(0.99, price + 0.01).toFixed(2), size: '100' }],
    min_order_size: String(market.orderMinSize), tick_size: String(market.orderPriceMinTickSize),
    neg_risk: market.negRisk, last_trade_price: price.toFixed(2),
  };
  return { ...book, hash: createHash('sha1').update(JSON.stringify(book)).digest('hex') };
}

export function registerClobRoutes(app, store) {
  // Separate service prefixes resolve Gamma /markets versus CLOB /markets.
  const get = (path, handler) => { app.get(`/clob${path}`, handler); app.get(path, handler); };
  const post = (path, handler) => { app.post(`/clob${path}`, handler); app.post(path, handler); };
  const missing = c => c.json({ error: 'No orderbook exists for the requested token id' }, 404);
  const value = (kind, tokenId, side) => {
    const book = orderBook(store, tokenId);
    if (!book) return null;
    const bid = Number(book.bids.at(-1).price);
    const ask = Number(book.asks.at(-1).price);
    if (kind === 'book') return book;
    if (kind === 'midpoint') return { mid: ((bid + ask) / 2).toFixed(2) };
    if (kind === 'spread') return { spread: (ask - bid).toFixed(2) };
    // The API's BUY side requests the bid, SELL requests the ask.
    if (kind === 'price') return { price: side === 'BUY' ? bid.toFixed(2) : ask.toFixed(2) };
    if (kind === 'last-trade-price') return { price: book.last_trade_price, side: 'BUY' };
  };
  get('/', c => c.json('OK'));
  get('/time', c => c.json(FIXTURE_TIME));
  for (const kind of ['book', 'midpoint', 'spread', 'price', 'last-trade-price']) {
    get(`/${kind}`, c => {
      const side = c.req.query('side')?.toUpperCase();
      if (kind === 'price' && !['BUY', 'SELL'].includes(side)) return c.json({ error: 'Invalid side' }, 400);
      const result = value(kind, c.req.query('token_id'), side);
      return result ? c.json(result) : missing(c);
    });
  }
  for (const [path, kind, field] of [['books', 'book'], ['midpoints', 'midpoint', 'mid'], ['spreads', 'spread', 'spread'], ['prices', 'price', 'price'], ['last-trades-prices', 'last-trade-price']]) {
    post(`/${path}`, async c => {
      const body = await c.req.json().catch(() => null);
      if (!Array.isArray(body) || body.length > 500) return c.json({ error: 'Expected up to 500 token requests' }, 400);
      const result = field ? {} : [];
      for (const item of body) {
        if (!item || typeof item.token_id !== 'string' || (item.side !== undefined && typeof item.side !== 'string')) return c.json({ error: 'Invalid token request' }, 400);
        const side = item.side?.toUpperCase();
        if (kind === 'price' && !['BUY', 'SELL'].includes(side)) return c.json({ error: 'Invalid side' }, 400);
        const entry = value(kind, item.token_id, side);
        if (!entry) return missing(c);
        if (kind === 'price') (result[item.token_id] ??= {})[side] = entry.price;
        else if (field) result[item.token_id] = entry[field];
        else result.push(kind === 'book' ? entry : { token_id: item.token_id, ...entry });
      }
      return c.json(result);
    });
  }
  for (const [path, build] of [
    ['tick-size', t => ({ minimum_tick_size: t.market.orderPriceMinTickSize })],
    ['neg-risk', t => ({ neg_risk: t.market.negRisk })],
    ['fee-rate', () => ({ base_fee: 0 })],
  ]) get(`/${path}`, c => { const token = findToken(store, c.req.query('token_id')); return token ? c.json(build(token)) : missing(c); });
  get('/markets-by-token/:tokenId', c => {
    const token = findToken(store, c.req.param('tokenId'));
    return token ? c.json({ condition_id: token.market.conditionId }) : missing(c);
  });
  get('/clob-markets/:conditionId', c => {
    const market = Object.values(state(store).markets).find(m => m.conditionId === c.req.param('conditionId'));
    if (!market) return missing(c);
    return c.json({ fd: { r: 0, e: 0 }, mts: market.orderPriceMinTickSize, nr: market.negRisk,
      t: JSON.parse(market.clobTokenIds).map((t, i) => ({ t, o: JSON.parse(market.outcomes)[i] })) });
  });
  get('/prices-history', c => {
    const token = findToken(store, c.req.query('market'));
    if (!token) return missing(c);
    const start = Number(c.req.query('startTs') ?? FIXTURE_TIME - 86400);
    const end = Number(c.req.query('endTs') ?? FIXTURE_TIME);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) return c.json({ error: 'Invalid time range' }, 400);
    return c.json({ history: [{ t: FIXTURE_TIME - 86400, p: token.price }, { t: FIXTURE_TIME, p: token.price }].filter(p => p.t >= start && p.t <= end) });
  });
}
