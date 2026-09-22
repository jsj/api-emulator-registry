import assert from 'node:assert/strict';
import { createPublicClient, createSecureClient, forkEnvironmentConfig } from '@polymarket/client';
import { fetchTickSize, fetchNegRisk } from '@polymarket/client/actions';
import { createApp, Store, withServer } from '../../../scripts/cli-smoke-runtime.mjs';
import { plugin } from '../api-emulator.mjs';
import { FIXTURE_ADDRESS } from '../src/store.mjs';
import { FIXTURE_CREDENTIALS } from '../src/routes/orders.mjs';

const app = createApp();
plugin.register(app, new Store());
await withServer(app, async baseUrl => {
  const client = createPublicClient({ environment: forkEnvironmentConfig({
    name: 'emulator', gamma: { rest: `${baseUrl}/gamma` }, clob: { rest: `${baseUrl}/clob` }, data: { rest: `${baseUrl}/data` },
    rpc: `${baseUrl}/unsupported-rpc`, relayer: { rest: `${baseUrl}/unsupported-relayer` },
  }) });
  const markets = [];
  for await (const page of client.listMarkets({ pageSize: 1, closed: false })) markets.push(...page.items);
  assert.equal(markets.length, 2);
  assert.equal(new Set(markets.map(m => m.id)).size, 2);
  assert.equal(markets[0].outcomes.yes.tokenId, '1001');
  const search = await client.search({ q: 'temperature' }).firstPage();
  assert.equal(search.items.events.length, 1);
  const positions = await client.listPositions({ user: FIXTURE_ADDRESS }).firstPage();
  assert.equal(positions.items[0].currentSize, '10');
  assert.equal(positions.items[0].currentValue, '5.80');
  assert.equal((await client.fetchPortfolioValue({ user: FIXTURE_ADDRESS })).value, '5.8000');
  const book = await client.fetchOrderBook({ tokenId: '1001' });
  assert.equal(book.bids[0].price, '0.57');
  assert.equal(book.asks[0].price, '0.59');
  assert.equal(book.tickSize, 0.01);
  assert.equal((await client.fetchOrderBooks([{ tokenId: '1001' }, { tokenId: '1002' }])).length, 2);
  assert.equal(await client.fetchMidpoint({ tokenId: '1001' }), '0.58');
  assert.equal(await client.fetchSpread({ tokenId: '1001' }), '0.02');
  assert.equal(await client.fetchPrice({ tokenId: '1001', side: 'BUY' }), '0.57');
  assert.equal(await fetchTickSize(client, { tokenId: '1001' }), 0.01);
  assert.equal(await fetchNegRisk(client, { tokenId: '1001' }), false);
  assert.equal((await client.fetchLastTradePrice({ tokenId: '1001' })).price, '0.58');
  await assert.rejects(() => client.fetchOrderBook({ tokenId: '9999' }));
  const secure = await createSecureClient({
    environment: client.environment, wallet: FIXTURE_ADDRESS,
    credentials: { ...FIXTURE_CREDENTIALS, key: FIXTURE_CREDENTIALS.apiKey },
    signer: { getAddress: async () => FIXTURE_ADDRESS,
      signTypedData: async () => { throw new Error('Unexpected wallet signing'); },
      signMessage: async () => { throw new Error('Unexpected wallet signing'); },
      sendTransaction: async () => { throw new Error('Onchain operations are outside the fixture'); } },
  });
  // Exercise real SDK serialization and HMAC headers with an explicitly fake signed order.
  const posted = await secure.postOrder({ salt: '1', maker: FIXTURE_ADDRESS, signer: FIXTURE_ADDRESS,
    tokenId: '1001', side: 'BUY', makerAmount: '5000000', takerAmount: '10000000',
    signature: `0x${'00'.repeat(65)}`, signatureType: 0, expiration: '0', orderType: 'GTC' });
  assert.equal(posted.ok, true);
  assert.equal(posted.status, 'live');
  const order = await secure.fetchOrder({ orderId: posted.orderId });
  assert.equal(order.originalSize, '10');
  assert.equal(order.status, 'LIVE');
  const canceled = await secure.cancelOrder({ orderId: posted.orderId });
  assert.deepEqual(canceled.canceled, [posted.orderId]);
  assert.equal((await secure.fetchOrder({ orderId: posted.orderId })).status, 'CANCELED');
  await client.closeSubscriptions();
  await secure.closeSubscriptions();
});
console.log('polymarket official @polymarket/client@0.10.0 smoke ok');
