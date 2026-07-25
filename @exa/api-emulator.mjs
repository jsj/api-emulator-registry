import { registerRoutes } from './src/routes/http.mjs';

export const contract = {
  provider: 'exa',
  source: 'Exa Public API OpenAPI 2.0.0 compatible search subset',
  docs: 'https://docs.exa.ai',
  openapi: 'https://api.exa.ai/openapi.json',
  scope: ['search', 'contents', 'findSimilar', 'answer'],
  fidelity: 'deterministic-subset',
};

export const plugin = {
  name: 'exa',
  register(app, store) {
    registerRoutes(app, store, contract);
  },
};

export const label = 'Exa API emulator';
export const endpoints = 'search, contents, findSimilar, answer';
export const initConfig = {
  exa: {
    apiKey: 'exa-emulator-key',
  },
};

export default plugin;
