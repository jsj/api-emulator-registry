import { fixedNow, getState, routeError, setState } from '../../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'nytimes:state';

function defaultState() {
  return {
    articles: [
      {
        web_url: 'https://www.nytimes.com/2026/01/01/technology/emulator-api.html',
        snippet: 'A deterministic New York Times API emulator story.',
        lead_paragraph: 'The emulator returns stable Article Search payloads.',
        abstract: 'Stable Article Search payloads for local development.',
        source: 'The New York Times',
        pub_date: fixedNow,
        document_type: 'article',
        news_desk: 'Technology',
        section_name: 'Technology',
        type_of_material: 'News',
        _id: 'nyt://article/emulator-article-1',
        headline: { main: 'API Emulator Makes Local Testing Predictable' },
        byline: { original: 'By API Emulator' },
        keywords: [{ name: 'subject', value: 'APIs', rank: 1 }],
      },
    ],
    topStories: [{ section: 'technology', title: 'API Emulator Makes Local Testing Predictable', url: 'https://www.nytimes.com/2026/01/01/technology/emulator-api.html', created_date: fixedNow }],
    bookLists: [
      {
        display_name: 'Audio Fiction',
        list_name: 'Audio Fiction',
        list_name_encoded: 'audio-fiction',
        books: [
          ['The Calamity Club', 'Kathryn Stockett', '9780000000001'],
          ['Yesteryear', 'Caro Claire Burke', '9780000000002'],
          ['Dungeon Crawler Carl', 'Matt Dinniman', '9780000000003'],
          ['Theo of Golden', 'Allen Levi', '9780000000004'],
          ['The Divorce', 'Freida McFadden', '9780000000005'],
          ['Whistler', 'Ann Patchett', '9780000000006'],
        ],
      },
      {
        display_name: 'Audio Nonfiction',
        list_name: 'Audio Nonfiction',
        list_name_encoded: 'audio-nonfiction',
        books: [
          ['Regime Change', 'Maggie Haberman and Jonathan Swan', '9780000000007'],
          ['Strangers', 'Belle Burden', '9780000000008'],
          ['The Land and Its People', 'David Sedaris', '9780000000009'],
          ['Communion', 'JD Vance', '9780000000010'],
          ['Famesick', 'Lena Dunham', '9780000000011'],
          ['London Falling', 'Patrick Radden Keefe', '9780000000012'],
        ],
      },
    ],
  };
}

const state = (store) => getState(store, STATE_KEY, defaultState);

export function seedFromConfig(store, baseUrl = 'https://api.nytimes.com', config = {}) {
  return setState(store, STATE_KEY, { ...defaultState(), baseUrl, ...config });
}

export const contract = {
  provider: 'nytimes',
  source: 'NYTimes public_api_specs OpenAPI subset',
  docs: 'https://developer.nytimes.com/apis',
  baseUrl: 'https://api.nytimes.com',
  scope: ['article_search', 'archive', 'top_stories'],
  fidelity: 'deterministic-subset',
};

export const plugin = {
  name: 'nytimes',
  register(app, store, _webhooks, baseUrl = '') {
    app.get('/svc/search/v2/articlesearch.json', (c) => {
      const q = c.req.query('q')?.toLowerCase();
      const articles = state(store).articles.filter((article) => !q || article.headline.main.toLowerCase().includes(q) || article.snippet.toLowerCase().includes(q));
      return c.json({ status: 'OK', copyright: 'Copyright (c) 2026 The New York Times Company. All Rights Reserved.', response: { docs: articles, meta: { hits: articles.length, offset: 0, time: 1 } } });
    });
    app.get('/svc/archive/v1/:year/:month.json', (c) => {
      const docs = state(store).articles.map((article) => ({ ...article, uri: article._id }));
      return c.json({ status: 'OK', copyright: 'Copyright (c) 2026 The New York Times Company. All Rights Reserved.', response: { docs, meta: { hits: docs.length } } });
    });
    app.get('/svc/topstories/v2/:section{.+}', (c) => {
      const section = c.req.param('section').replace(/\.json$/, '');
      const stories = state(store).topStories.filter((story) => section === 'home' || story.section === section);
      return c.json({ status: 'OK', section, num_results: stories.length, results: stories });
    });
    app.get('/svc/books/v3/lists/overview.json', (c) => {
      const lists = state(store).bookLists.map((list) => ({
        ...list,
        books: list.books.map(([title, author, isbn], index) => ({
          rank: index + 1,
          title,
          author,
          description: `A deterministic ${list.display_name.toLowerCase()} fixture for local development.`,
          book_image: `${baseUrl}/fixtures/books/${isbn}.svg`,
          primary_isbn13: isbn,
          book_uri: `nyt://book/${isbn}`,
        })),
      }));
      return c.json({
        status: 'OK',
        copyright: 'Copyright (c) 2026 The New York Times Company.',
        num_results: lists.length,
        results: { published_date: '2026-07-21', lists },
      });
    });
    app.get('/svc/books/v3/lists/current/:list.json', (c) => {
      const requested = c.req.param('list');
      const list = state(store).bookLists.find((item) => item.list_name_encoded === requested);
      if (!list) return routeError(c, `List ${requested} is not seeded`, 404, 'not_found');
      return c.json({ status: 'OK', results: list });
    });
    app.get('/fixtures/books/:isbn.svg', (c) => {
      const isbn = c.req.param('isbn');
      const entry = state(store).bookLists.flatMap((list) => list.books).find((book) => book[2] === isbn);
      if (!entry) return c.notFound();
      c.header('content-type', 'image/svg+xml; charset=utf-8');
      return c.body(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="#343438"/><text x="300" y="285" fill="white" font-family="system-ui,sans-serif" font-size="36" font-weight="700" text-anchor="middle">${entry[0]}</text><text x="300" y="335" fill="#aaa6ff" font-family="system-ui,sans-serif" font-size="22" text-anchor="middle">${entry[1]}</text></svg>`);
    });
    app.get('/nytimes/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'New York Times API emulator';
export const endpoints = 'article search, archive, top stories, Books overview and current lists';
export const initConfig = { nytimes: { apiKey: 'nyt-emulator-key' } };

export default plugin;
