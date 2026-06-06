import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { plugin } from './api-emulator.mjs';

const h = createHarness(plugin);

const me = await h.call('GET', '/auth/me');
assert.equal(me.status, 200);
assert.equal(me.payload.email, 'agent@example.com');

const created = await h.call('POST', '/cards/create', { amountCents: 2500 });
assert.equal(created.status, 200);
assert.match(created.payload.id, /^card_/);
assert.equal(created.payload.balanceCents, 2500);
assert.equal(created.payload.last4.length, 4);

const listed = await h.call('GET', '/cards');
assert.equal(listed.status, 200);
assert.ok(listed.payload.cards.some((card) => card.id === created.payload.id));

const details = await h.call('GET', `/cards/${created.payload.id}/details`);
assert.equal(details.status, 200);
assert.match(details.payload.pan, /^424242424242/);
assert.match(details.payload.cvv, /^\d{3}$/);

const balance = await h.call('GET', `/cards/${created.payload.id}/balance`);
assert.equal(balance.status, 200);
assert.equal(balance.payload.balanceCents, 2500);

const paymentMethods = await h.call('GET', '/payment-methods/list');
assert.equal(paymentMethods.status, 200);
assert.equal(paymentMethods.payload.paymentMethods[0].id, 'pm_emulator_1');

const plan = await h.call('GET', '/subscriptions/status');
assert.equal(plan.status, 200);
assert.equal(plan.payload.plan, 'free');

console.log('agentcard smoke ok');
