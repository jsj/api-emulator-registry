import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
const auth = { authorization: 'Bearer context_emulator_key' };

assert.equal(contract.provider, 'context');

const brand = await harness.call('GET', '/v1/brand/retrieve?domain=stripe.com', undefined, auth);
assert.equal(brand.status, 200);
assert.equal(brand.payload.status, 'ok');
assert.equal(brand.payload.brand.domain, 'stripe.com');
assert.equal(brand.payload.brand.colors[0].hex, '#635BFF');

const simpleBrand = await harness.call('GET', '/brand/retrieve/simple?domain=context.dev', undefined, auth);
assert.equal(simpleBrand.payload.brand.domain, 'context.dev');
assert.ok(simpleBrand.payload.brand.logos[0].url.includes('context.dev'));

const markdown = await harness.call('GET', '/web/scrape/markdown?url=https%3A%2F%2Fexample.com%2Fpricing', undefined, auth);
assert.equal(markdown.status, 200);
assert.match(markdown.payload.markdown, /Example/);

const html = await harness.call('GET', '/web/scrape/html?url=https%3A%2F%2Fexample.com', undefined, auth);
assert.match(html.payload.html, /Context\.dev emulator HTML/);

const images = await harness.call('GET', '/web/scrape/images?url=https%3A%2F%2Fexample.com', undefined, auth);
assert.equal(images.payload.images[0].enrichment.type, 'logo');

const sitemap = await harness.call('GET', '/web/scrape/sitemap?domain=example.com', undefined, auth);
assert.deepEqual(sitemap.payload.meta, { sitemapsDiscovered: 1, sitemapsFetched: 1, sitemapsSkipped: 0, errors: 0 });

const crawl = await harness.call('POST', '/web/crawl', { url: 'https://example.com', maxPages: 1 }, { ...auth, 'content-type': 'application/json' });
assert.equal(crawl.payload.metadata.numSucceeded, 1);

const styleguide = await harness.call('GET', '/web/styleguide?domain=example.com', undefined, auth);
assert.equal(styleguide.payload.styleguide.typography.headings.h1.fontFamily, 'Inter');

const fonts = await harness.call('GET', '/web/fonts?domain=example.com', undefined, auth);
assert.equal(fonts.payload.fonts[0].font, 'Inter');

const product = await harness.call('POST', '/brand/ai/product', { url: 'https://example.com/products/emulator' }, { ...auth, 'content-type': 'application/json' });
assert.equal(product.payload.product.sku, 'emu-product-001');

const aiQuery = await harness.call(
  'POST',
  '/brand/ai/query',
  {
    domain: 'example.com',
    data_to_extract: [{ datapoint_name: 'pricing_summary', datapoint_example: '$49 one-time' }],
  },
  { ...auth, 'content-type': 'application/json' },
);
assert.equal(aiQuery.payload.data_extracted[0].datapoint_value, '$49 one-time');

const screenshot = await harness.call('GET', '/web/screenshot?domain=example.com&viewport%5Bwidth%5D=1440', undefined, auth);
assert.equal(screenshot.payload.width, 1440);

const naics = await harness.call('GET', '/web/naics?input=example.com', undefined, auth);
assert.equal(naics.payload.codes[0].code, '541511');

const sic = await harness.call('GET', '/web/sic?input=example.com&type=latest_sec', undefined, auth);
assert.equal(sic.payload.classification, 'latest_sec');

const transaction = await harness.call('GET', '/brand/transaction_identifier?transaction_info=STRIPE%20PAYMENT', undefined, auth);
assert.equal(transaction.payload.brand.domain, 'stripe.com');

const unauthorized = await harness.call('GET', '/brand/retrieve?domain=example.com', undefined, { authorization: 'Bearer wrong' });
assert.equal(unauthorized.status, 401);
assert.equal(unauthorized.payload.error_code, 'UNAUTHORIZED');

const state = await harness.call('GET', '/inspect/state');
assert.ok(state.payload.requests.some((request) => request.endpoint === '/brand/retrieve'));

console.log('context smoke ok');
