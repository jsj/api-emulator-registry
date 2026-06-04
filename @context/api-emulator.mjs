import { getState, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'context:state';
const BASE_URL = 'https://api.context.dev/v1';

function normalizeDomain(value = '') {
  const input = String(value).trim();
  if (!input) return '';
  try {
    return new URL(input.includes('://') ? input : `https://${input}`).hostname.replace(/^www\./, '');
  } catch {
    return input.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
}

function titleFromDomain(domain) {
  const label = normalizeDomain(domain).split('.')[0] || 'example';
  return label
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function defaultBrand(domain = 'example.com') {
  const normalized = normalizeDomain(domain) || 'example.com';
  const title = titleFromDomain(normalized);
  return {
    domain: normalized,
    title,
    description: `${title} is a deterministic brand profile served by the Context.dev emulator.`,
    slogan: 'Structured web data for local testing',
    colors: [
      { hex: '#111827', name: 'Ink' },
      { hex: '#4F46E5', name: 'Primary' },
      { hex: '#F9FAFB', name: 'Canvas' },
    ],
    logos: [
      {
        url: `https://cdn.context.dev/emulator/${normalized}/logo.svg`,
        mode: 'light',
        type: 'logo',
        resolution: { width: 256, height: 96, aspect_ratio: 2.67 },
      },
    ],
    backdrops: [{ url: `https://cdn.context.dev/emulator/${normalized}/backdrop.png`, type: 'gradient' }],
    socials: [{ type: 'linkedin', url: `https://www.linkedin.com/company/${normalized.split('.')[0]}` }],
    address: { country: 'US', city: 'San Francisco', region: 'CA' },
    stock: null,
    industries: {
      eic: [{ industry: 'Software', subindustry: 'Developer Tools', confidence: 'high' }],
      naics: [{ code: '541511', name: 'Custom Computer Programming Services', confidence: 'high' }],
      sic: [{ code: '7372', name: 'Prepackaged Software', confidence: 'high' }],
    },
    links: {
      homepage: `https://${normalized}`,
      careers: `https://${normalized}/careers`,
      privacy: `https://${normalized}/privacy`,
      terms: `https://${normalized}/terms`,
    },
    primary_language: 'english',
  };
}

function defaultState(baseUrl = BASE_URL) {
  const brands = {
    'context.dev': defaultBrand('context.dev'),
    'example.com': defaultBrand('example.com'),
    'stripe.com': {
      ...defaultBrand('stripe.com'),
      title: 'Stripe',
      colors: [
        { hex: '#635BFF', name: 'Blurple' },
        { hex: '#0A2540', name: 'Navy' },
        { hex: '#F6F9FC', name: 'Cloud' },
      ],
    },
  };
  return {
    baseUrl,
    acceptedTokens: ['context_emulator_key', 'ctx_emulator_key', 'test_api_key'],
    brands,
    requests: [],
  };
}

const state = (store) => getState(store, STATE_KEY, () => defaultState());
const save = (store, next) => setState(store, STATE_KEY, next);

export function seedFromConfig(store, baseUrl = BASE_URL, config = {}) {
  const seeded = defaultState(baseUrl);
  return save(store, {
    ...seeded,
    ...config,
    brands: { ...seeded.brands, ...(config.brands ?? {}) },
    acceptedTokens: config.acceptedTokens ?? seeded.acceptedTokens,
  });
}

function error(c, message, status = 400, errorCode = 'INPUT_VALIDATION_ERROR') {
  return c.json({ message, error_code: errorCode }, status);
}

function requireAuth(c, current) {
  const header = c.req.header?.('authorization') ?? '';
  const token = header.match(/^Bearer\s+(.+)$/i)?.[1] ?? '';
  if (!token || current.acceptedTokens.includes(token)) return null;
  return error(c, 'Invalid API key', 401, 'UNAUTHORIZED');
}

function query(c, name, fallback = '') {
  return c.req.query?.(name) ?? fallback;
}

async function body(c) {
  try {
    return await c.req.json();
  } catch {
    return {};
  }
}

function record(current, endpoint, params = {}) {
  current.requests.push({ endpoint, params, requestedAt: new Date().toISOString() });
}

function brandResponse(current, domain) {
  const normalized = normalizeDomain(domain);
  const brand = current.brands[normalized] ?? defaultBrand(normalized);
  return { status: 'ok', brand, code: 200 };
}

function retrieveBrand(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const domain = query(c, 'domain');
  if (!domain) return error(c, 'domain query parameter is required');
  record(current, '/brand/retrieve', { domain: normalizeDomain(domain) });
  save(store, current);
  return c.json(brandResponse(current, domain));
}

function retrieveSimpleBrand(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const domain = query(c, 'domain');
  if (!domain) return error(c, 'domain query parameter is required');
  const { brand } = brandResponse(current, domain);
  record(current, '/brand/retrieve/simple', { domain: brand.domain });
  save(store, current);
  return c.json({
    status: 'ok',
    brand: {
      domain: brand.domain,
      title: brand.title,
      colors: brand.colors,
      logos: brand.logos,
      backdrops: brand.backdrops,
    },
    code: 200,
  });
}

function styleguide(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const domain = normalizeDomain(query(c, 'domain') || query(c, 'directUrl'));
  if (!domain) return error(c, 'domain or directUrl query parameter is required');
  record(current, '/web/styleguide', { domain });
  save(store, current);
  return c.json({
    status: 'ok',
    domain,
    styleguide: {
      mode: 'light',
      colors: { accent: '#4F46E5', background: '#FFFFFF', text: '#111827' },
      typography: {
        headings: { h1: { fontFamily: 'Inter', fontSize: '48px', fontWeight: 700 } },
        body: { fontFamily: 'Inter', fontSize: '16px', lineHeight: '24px' },
      },
      elementSpacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '40px' },
      shadows: { sm: '0 1px 2px rgba(0,0,0,.08)', md: '0 8px 24px rgba(15,23,42,.12)' },
      fontLinks: { inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700' },
      components: { button: { primary: { css: 'background:#4F46E5;color:#fff;border-radius:8px;' } } },
    },
    code: 200,
  });
}

function fonts(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const domain = normalizeDomain(query(c, 'domain') || query(c, 'directUrl'));
  if (!domain) return error(c, 'domain or directUrl query parameter is required');
  record(current, '/web/fonts', { domain });
  save(store, current);
  return c.json({
    status: 'ok',
    domain,
    fonts: [
      {
        font: 'Inter',
        uses: ['body', 'heading', 'button'],
        fallbacks: ['system-ui', 'sans-serif'],
        num_elements: 24,
        num_words: 520,
        percent_words: 86,
        percent_elements: 78,
      },
    ],
    fontLinks: { inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700' },
    code: 200,
  });
}

function scrapeMarkdown(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const url = query(c, 'url');
  if (!url) return error(c, 'url query parameter is required');
  record(current, '/web/scrape/markdown', { url });
  save(store, current);
  const domain = normalizeDomain(url);
  return c.json({ success: true, markdown: `# ${titleFromDomain(domain)}\n\nDeterministic markdown scraped from ${url}.`, url });
}

function scrapeHtml(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const url = query(c, 'url');
  if (!url) return error(c, 'url query parameter is required');
  record(current, '/web/scrape/html', { url });
  save(store, current);
  return c.json({ success: true, html: '<!doctype html><html><head><title>Emulator Page</title></head><body><main>Context.dev emulator HTML</main></body></html>', url });
}

function scrapeImages(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const url = query(c, 'url');
  if (!url) return error(c, 'url query parameter is required');
  const domain = normalizeDomain(url);
  record(current, '/web/scrape/images', { url });
  save(store, current);
  return c.json({
    success: true,
    images: [
      {
        src: `https://cdn.context.dev/emulator/${domain}/logo.svg`,
        element: 'img',
        type: 'url',
        alt: `${titleFromDomain(domain)} logo`,
        enrichment: { width: 256, height: 96, mimetype: 'image/svg+xml', url: `https://cdn.context.dev/emulator/${domain}/logo.svg`, type: 'logo' },
      },
    ],
    url,
  });
}

function sitemap(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const domain = normalizeDomain(query(c, 'domain'));
  if (!domain) return error(c, 'domain query parameter is required');
  record(current, '/web/scrape/sitemap', { domain });
  save(store, current);
  return c.json({
    success: true,
    domain,
    urls: [`https://${domain}/`, `https://${domain}/about`, `https://${domain}/pricing`],
    meta: { sitemapsDiscovered: 1, sitemapsFetched: 1, sitemapsSkipped: 0, errors: 0 },
  });
}

async function crawl(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const input = await body(c);
  if (!input.url) return error(c, 'url is required');
  record(current, '/web/crawl', { url: input.url, maxPages: input.maxPages ?? 1 });
  save(store, current);
  return c.json({
    results: [
      {
        markdown: `# ${titleFromDomain(normalizeDomain(input.url))}\n\nCrawled by the Context.dev emulator.`,
        metadata: { url: input.url, title: titleFromDomain(normalizeDomain(input.url)), crawlDepth: 0, statusCode: 200, success: true },
      },
    ],
    metadata: { numUrls: 1, maxCrawlDepth: 0, numSucceeded: 1, numFailed: 0, numSkipped: 0 },
  });
}

async function product(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const input = await body(c);
  if (!input.url) return error(c, 'url is required');
  record(current, '/brand/ai/product', { url: input.url });
  save(store, current);
  return c.json({
    is_product_page: true,
    platform: 'generic',
    product: {
      name: 'Emulator Product',
      description: `A deterministic product extracted from ${input.url}.`,
      price: 49,
      currency: 'USD',
      billing_frequency: 'one_time',
      pricing_model: 'flat',
      url: input.url,
      category: 'Software',
      features: ['Local API compatibility', 'Deterministic fixtures'],
      target_audience: ['developers', 'test suites'],
      tags: ['emulator', 'context.dev'],
      image_url: `https://cdn.context.dev/emulator/${normalizeDomain(input.url)}/product.png`,
      images: [`https://cdn.context.dev/emulator/${normalizeDomain(input.url)}/product.png`],
      sku: 'emu-product-001',
    },
  });
}

async function aiQuery(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const input = await body(c);
  const domain = normalizeDomain(input.domain || input.url);
  if (!domain) return error(c, 'domain is required');
  const dataPoints = input.data_to_extract ?? [];
  record(current, '/brand/ai/query', { domain, datapoints: dataPoints.length });
  save(store, current);
  return c.json({
    status: 'ok',
    domain,
    urls_analyzed: [`https://${domain}`],
    data_extracted: dataPoints.map((point) => ({
      datapoint_name: point.datapoint_name,
      datapoint_value: point.datapoint_example ?? `Emulator value for ${point.datapoint_name}`,
    })),
  });
}

function screenshot(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const domain = normalizeDomain(query(c, 'domain') || query(c, 'directUrl'));
  if (!domain) return error(c, 'domain or directUrl query parameter is required');
  record(current, '/web/screenshot', { domain });
  save(store, current);
  return c.json({
    status: 'ok',
    domain,
    screenshot: `https://cdn.context.dev/emulator/${domain}/screenshot.png`,
    screenshotType: query(c, 'fullScreenshot') === 'true' ? 'full' : 'viewport',
    width: Number(query(c, 'viewport[width]', '1920')),
    height: Number(query(c, 'viewport[height]', '1080')),
    code: 200,
  });
}

function naics(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const input = query(c, 'input');
  if (!input) return error(c, 'input query parameter is required');
  record(current, '/web/naics', { input });
  save(store, current);
  return c.json({
    status: 'ok',
    domain: normalizeDomain(input) || input,
    type: 'naics',
    codes: [{ code: '541511', name: 'Custom Computer Programming Services', confidence: 'high' }],
  });
}

function sic(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const input = query(c, 'input');
  if (!input) return error(c, 'input query parameter is required');
  record(current, '/web/sic', { input });
  save(store, current);
  return c.json({
    status: 'ok',
    domain: normalizeDomain(input) || input,
    type: 'sic',
    classification: query(c, 'type', 'original_sic'),
    codes: [{ code: '7372', name: 'Prepackaged Software', confidence: 'high', majorGroup: '73', majorGroupName: 'Business Services' }],
  });
}

function transactionIdentifier(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const transactionInfo = query(c, 'transaction_info');
  if (!transactionInfo) return error(c, 'transaction_info query parameter is required');
  record(current, '/brand/transaction_identifier', { transaction_info: transactionInfo });
  save(store, current);
  const domain = transactionInfo.toLowerCase().includes('stripe') ? 'stripe.com' : 'example.com';
  return c.json(brandResponse(current, domain));
}

function registerContextRoutes(app, store, prefix = '') {
  app.get(`${prefix}/brand/retrieve`, (c) => retrieveBrand(c, store));
  app.get(`${prefix}/brand/retrieve/simple`, (c) => retrieveSimpleBrand(c, store));
  app.get(`${prefix}/brand/transaction_identifier`, (c) => transactionIdentifier(c, store));
  app.post(`${prefix}/brand/ai/product`, (c) => product(c, store));
  app.post(`${prefix}/brand/ai/query`, (c) => aiQuery(c, store));
  app.get(`${prefix}/web/styleguide`, (c) => styleguide(c, store));
  app.get(`${prefix}/web/fonts`, (c) => fonts(c, store));
  app.get(`${prefix}/web/scrape/markdown`, (c) => scrapeMarkdown(c, store));
  app.get(`${prefix}/web/scrape/html`, (c) => scrapeHtml(c, store));
  app.get(`${prefix}/web/scrape/images`, (c) => scrapeImages(c, store));
  app.get(`${prefix}/web/scrape/sitemap`, (c) => sitemap(c, store));
  app.post(`${prefix}/web/crawl`, (c) => crawl(c, store));
  app.get(`${prefix}/web/screenshot`, (c) => screenshot(c, store));
  app.get(`${prefix}/web/naics`, (c) => naics(c, store));
  app.get(`${prefix}/web/sic`, (c) => sic(c, store));
}

export const contract = {
  provider: 'context',
  source: 'Context.dev documented OpenAPI schema',
  docs: 'https://docs.context.dev',
  spec: 'https://app.stainless.com/api/spec/documented/context.dev/openapi.documented.yml',
  baseUrl: BASE_URL,
  auth: 'Authorization: Bearer <api-key>',
  scope: ['brand-retrieve', 'web-scrape', 'web-extraction', 'industry-classification'],
  fidelity: 'deterministic-subset',
};

export const plugin = {
  name: 'context',
  register(app, store) {
    registerContextRoutes(app, store);
    registerContextRoutes(app, store, '/v1');
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'Context.dev API emulator';
export const endpoints = 'brand retrieve, web scrape markdown/html/images, crawl, styleguide, fonts, product, AI query, screenshot, NAICS, SIC';
export const initConfig = { context: { apiKey: 'context_emulator_key' } };

export default plugin;
