import { createToken, fixedNow, getState, readBody, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'agentcard:state';

function makeCard(input = {}, index = 1) {
  const amount = Number(input.amountCents ?? input.amount_cents ?? input.spendLimitCents ?? 5000);
  return {
    id: input.id ?? createToken('card', index),
    last4: input.last4 ?? String(4241 + index).padStart(4, '0').slice(-4),
    expiry: input.expiry ?? '12/29',
    balanceCents: input.balanceCents ?? input.balance_cents ?? amount,
    spendLimitCents: input.spendLimitCents ?? input.spend_limit_cents ?? amount,
    status: input.status ?? 'OPEN',
    sandbox: input.sandbox ?? true,
    pan: input.pan ?? `424242424242${String(4241 + index).padStart(4, '0').slice(-4)}`,
    cvv: input.cvv ?? String(100 + index).padStart(3, '0'),
    createdAt: input.createdAt ?? input.created_at ?? fixedNow,
    updatedAt: input.updatedAt ?? input.updated_at ?? fixedNow,
  };
}

function initialState(config = {}) {
  const cards = (config.cards ?? [makeCard({ id: 'card_emulator_1', last4: '4242', spendLimitCents: 5000, balanceCents: 5000, pan: '4242424242424242', cvv: '123' })]).map((card, index) =>
    makeCard(card, index + 1),
  );
  return {
    user: config.user ?? { id: 'user_emulator', email: 'agent@example.com', mode: 'live' },
    settings: config.settings ?? { requireApprovalForDetails: false, autoCloseCards: true, defaultCardAmountCents: 5000 },
    plan: config.plan ?? 'free',
    paymentMethods: config.paymentMethods ?? [{ id: 'pm_emulator_1', brand: 'Visa', last4: '4242', expMonth: 12, expYear: 2029, isDefault: true }],
    cards,
    transactions:
      config.transactions ??
      [
        {
          id: 'txn_emulator_1',
          cardId: cards[0]?.id ?? 'card_emulator_1',
          amountCents: 1299,
          merchant: 'API Emulator Store',
          status: 'SETTLED',
          source: 'emulator',
          createdAt: fixedNow,
        },
      ],
    conversations: config.conversations ?? [],
    nextCard: cards.length + 1,
    nextTransaction: 2,
    nextApproval: 1,
    nextConversation: 1,
    nextMessage: 1,
  };
}

const state = (store) => getState(store, STATE_KEY, () => initialState());
const save = (store, next) => setState(store, STATE_KEY, next);

function agentcardError(c, message, status = 400, extra = {}) {
  return c.json({ error: extra.error ?? message, message, ...extra }, status);
}

function findCard(s, cardId) {
  return s.cards.find((card) => card.id === cardId);
}

function publicCard(card) {
  const { pan, cvv, ...rest } = card;
  return rest;
}

function planUsage(s) {
  const maxCardsPerMonth = s.plan === 'basic' ? 15 : 5;
  const maxCardAmountCents = s.plan === 'basic' ? 50000 : 5000;
  return {
    cardsCreatedThisMonth: s.cards.length,
    maxCardsPerMonth,
    maxCardAmountCents,
  };
}

export function seedFromConfig(store, _baseUrl, config = {}) {
  return save(store, initialState(config));
}

export const contract = {
  provider: 'agentcard',
  source: 'Agentcard agent.txt and agent-cards CLI request contract',
  docs: 'https://www.agentcard.sh/agent.txt',
  baseUrl: 'https://api.agentcard.sh',
  auth: 'Authorization: Bearer <jwt>',
  scope: ['auth', 'cards', 'payment-methods', 'subscriptions', 'settings', 'support'],
  fidelity: 'stateful-rest-emulator',
};

export const plugin = {
  name: 'agentcard',
  register(app, store) {
    app.get('/auth/me', (c) => c.json(state(store).user));

    app.post('/auth/signup', async (c) => {
      const s = state(store);
      const body = await readBody(c);
      s.user.email = body.email ?? s.user.email;
      save(store, s);
      return c.json({ sessionId: 'session_emulator', magicLink: 'https://agentcard.sh/auth/magic?token=emulator' });
    });

    app.get('/users/me/mode', (c) => c.json({ mode: state(store).user.mode ?? 'live' }));

    app.post('/users/me/mode', async (c) => {
      const s = state(store);
      const body = await readBody(c);
      s.user.mode = body.mode ?? 'live';
      save(store, s);
      return c.json({ mode: s.user.mode });
    });

    app.get('/settings', (c) => c.json(state(store).settings));

    app.put('/settings', async (c) => {
      const s = state(store);
      s.settings = { ...s.settings, ...(await readBody(c)) };
      save(store, s);
      return c.json(s.settings);
    });

    app.patch('/settings', async (c) => {
      const s = state(store);
      s.settings = { ...s.settings, ...(await readBody(c)) };
      save(store, s);
      return c.json(s.settings);
    });

    app.get('/cards', (c) => c.json({ cards: state(store).cards.map(publicCard) }));

    app.post('/cards/user-info', async (c) => {
      const s = state(store);
      const body = await readBody(c);
      s.user.phoneNumber = body.phoneNumber ?? body.phone_number;
      s.user.termsAccepted = body.termsAccepted ?? body.terms_accepted ?? true;
      save(store, s);
      return c.json({ status: 'ok' });
    });

    app.post('/cards/create', async (c) => {
      const s = state(store);
      const body = await readBody(c);
      const amountCents = Number(body.amountCents ?? body.amount_cents ?? 5000);
      const usage = planUsage(s);
      if (amountCents > usage.maxCardAmountCents) return agentcardError(c, `Max card amount is $${(usage.maxCardAmountCents / 100).toFixed(2)}`, 422, { status: 'limit_error' });
      if (s.cards.length >= usage.maxCardsPerMonth) return agentcardError(c, 'Monthly card limit reached', 422, { status: 'limit_error' });
      const card = makeCard({ amountCents, id: createToken('card', s.nextCard) }, s.nextCard);
      s.nextCard += 1;
      s.cards.unshift(card);
      save(store, s);
      return c.json(publicCard(card));
    });

    app.post('/cards/create/approved', async (c) => {
      const s = state(store);
      const card = makeCard({ id: createToken('card', s.nextCard) }, s.nextCard);
      s.nextCard += 1;
      s.cards.unshift(card);
      save(store, s);
      return c.json(publicCard(card));
    });

    app.get('/cards/:cardId/details', (c) => {
      const card = findCard(state(store), c.req.param('cardId'));
      return card ? c.json(card) : agentcardError(c, 'Card not found', 404);
    });

    app.get('/cards/:cardId/details/approved', (c) => {
      const card = findCard(state(store), c.req.param('cardId'));
      return card ? c.json(card) : agentcardError(c, 'Card not found', 404);
    });

    app.get('/cards/:cardId/balance', (c) => {
      const card = findCard(state(store), c.req.param('cardId'));
      return card ? c.json({ cardId: card.id, balanceCents: card.balanceCents, cached: false }) : agentcardError(c, 'Card not found', 404);
    });

    app.get('/cards/:cardId/transactions', (c) => {
      const s = state(store);
      const limit = Math.max(1, Math.min(Number(c.req.query('limit') ?? 20), 100));
      const status = c.req.query('status');
      const transactions = s.transactions.filter((tx) => tx.cardId === c.req.param('cardId')).filter((tx) => !status || tx.status === status).slice(0, limit);
      return c.json({ transactions });
    });

    app.post('/approvals/:approvalId/resolve', async (c) => c.json({ id: c.req.param('approvalId'), decision: (await readBody(c)).decision ?? 'approved', status: 'resolved' }));

    app.post('/payment-methods/setup', (c) => c.json({ checkoutUrl: 'https://agentcard.sh/emulator/payment-methods/setup' }));

    app.get('/payment-methods/status', (c) => c.json({ hasPaymentMethod: state(store).paymentMethods.length > 0 }));

    app.get('/payment-methods/list', (c) => c.json({ paymentMethods: state(store).paymentMethods }));

    app.post('/payment-methods/default', async (c) => {
      const s = state(store);
      const body = await readBody(c);
      s.paymentMethods = s.paymentMethods.map((pm) => ({ ...pm, isDefault: pm.id === (body.paymentMethodId ?? body.payment_method_id) }));
      save(store, s);
      return c.json({ ok: true });
    });

    app.delete('/payment-methods/:paymentMethodId', (c) => {
      const s = state(store);
      s.paymentMethods = s.paymentMethods.filter((pm) => pm.id !== c.req.param('paymentMethodId'));
      save(store, s);
      return c.json({ ok: true });
    });

    app.get('/subscriptions/status', (c) => {
      const s = state(store);
      return c.json({
        plan: s.plan,
        usage: planUsage(s),
        subscription: s.plan === 'basic' ? { status: 'active', currentPeriodEnd: '2026-02-01T00:00:00.000Z', cancelAtPeriodEnd: false } : null,
      });
    });

    app.post('/subscriptions/checkout', (c) => {
      const s = state(store);
      s.plan = 'basic';
      save(store, s);
      return c.json({ checkoutUrl: 'https://agentcard.sh/emulator/subscriptions/checkout' });
    });

    app.post('/subscriptions/cancel', (c) => {
      const s = state(store);
      s.plan = 'free';
      save(store, s);
      return c.json({ status: 'cancelled' });
    });

    app.post('/kyc/start', (c) => c.json({ verificationUrl: 'https://agentcard.sh/emulator/kyc' }));
    app.get('/kyc/status', (c) => c.json({ verified: true, status: 'verified' }));

    app.post('/chat/conversations', (c) => {
      const s = state(store);
      const conversation = { id: createToken('conversation', s.nextConversation++), messages: [], createdAt: fixedNow };
      s.conversations.push(conversation);
      save(store, s);
      return c.json(conversation);
    });

    app.get('/chat/conversations/:conversationId/messages', (c) => {
      const conversation = state(store).conversations.find((item) => item.id === c.req.param('conversationId'));
      return c.json(conversation?.messages ?? []);
    });

    app.post('/chat/conversations/:conversationId/messages', async (c) => {
      const s = state(store);
      const conversation = s.conversations.find((item) => item.id === c.req.param('conversationId'));
      if (!conversation) return agentcardError(c, 'Conversation not found', 404);
      const body = await readBody(c);
      const message = { id: createToken('msg', s.nextMessage++), role: 'visitor', body: body.body ?? body.message ?? '', createdAt: fixedNow };
      conversation.messages.push(message);
      save(store, s);
      return c.json(message);
    });
  },
};
