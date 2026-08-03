import {
  recordAnswer,
  recordContents,
  recordFindSimilar,
  recordSearch,
  validateSearchRequest,
} from '../concepts/search.mjs';
import { saveState, state } from '../store.mjs';

async function jsonBody(c) {
  return c.req.json().catch(() => ({}));
}

function persist(store, current, payload) {
  saveState(store, current);
  return payload;
}

export function registerRoutes(app, store, contract) {
  app.post('/search', async (c) => {
    const body = await jsonBody(c);
    const requestId = `exa_req_${Date.now()}`;
    if (c.req.header?.('x-api-key') === 'exa-payment-required') {
      return c.json({
        requestId,
        error: 'Payment required to access this resource',
        tag: 'X402_PAYMENT_REQUIRED',
        x402Version: 2,
      }, 402);
    }
    const validationError = validateSearchRequest(body);
    if (validationError) {
      return c.json({ requestId, error: validationError, tag: 'INVALID_REQUEST' }, 400);
    }
    const current = state(store);
    return c.json(persist(store, current, recordSearch(current, body)));
  });

  app.post('/contents', async (c) => {
    const current = state(store);
    return c.json(persist(store, current, recordContents(current, await jsonBody(c))));
  });

  app.post('/findSimilar', async (c) => {
    const current = state(store);
    return c.json(persist(store, current, recordFindSimilar(current, await jsonBody(c))));
  });

  app.post('/answer', async (c) => {
    const current = state(store);
    return c.json(persist(store, current, recordAnswer(current, await jsonBody(c))));
  });

  app.get('/inspect/contract', (c) => c.json(contract));
  app.get('/inspect/state', (c) => c.json(state(store)));
  app.post('/inspect/reset', (c) => {
    store.setData?.('exa:state', null);
    return c.json({ ok: true, state: state(store) });
  });
}
