![api-emulator cover](./.github/assets/cover.png)

<h1 align="center">API sandboxes for coding agents</h1>

<p align="center">Create the stateful API sandbox that your agent needs.<br>Run the same workflow 1,000 times without test accounts, rate limits, or stale data.</p>

<details open>
<summary align="center"><img src="https://cdn.jsdelivr.net/gh/jsj/agent-icons@5d407d8b74fe0361051aa8df6ccbc937470fd950/claude.svg" width="18" height="18" alt="Claude">&nbsp;<img src="https://cdn.jsdelivr.net/gh/jsj/agent-icons@5d407d8b74fe0361051aa8df6ccbc937470fd950/cursor.svg" width="18" height="18" alt="Cursor">&nbsp;<img src="https://cdn.jsdelivr.net/gh/jsj/agent-icons@5d407d8b74fe0361051aa8df6ccbc937470fd950/github-copilot.svg" width="18" height="18" alt="GitHub Copilot">&nbsp;<img src="https://cdn.jsdelivr.net/gh/jsj/agent-icons@5d407d8b74fe0361051aa8df6ccbc937470fd950/openai.svg" width="18" height="18" alt="OpenAI">&nbsp;&nbsp;<strong>Copy this prompt to your coding agent</strong></summary>

```text
Set up api-emulator for this repository.
First, read https://api-emulator.jsj.sh/agent.txt.
Inspect the repository and identify the APIs that its tests use.
For a private internal API, keep its provider in a private repository and use synthetic test data with no PII.
Before you edit files, describe the smallest setup plan.
Keep the existing provider SDKs.
Change only their base URLs and test credentials.
Start only the providers that the repository needs.
Add or update one representative integration test.
Run that test against the local emulator.
Do not use production credentials or change production configuration.
Reset emulator state after the test.
If the required provider behavior is unavailable, stop and report the missing behavior.
Report the changed files, local URLs, test command, test result, and remaining gaps.
```

</details>

## Quick start

This registry provides provider plugins for [api-emulator](https://github.com/jsj/api-emulator).

Use the plugins to run local API emulators for integration tests, agent evaluations, and CI.

Each emulator stores state and returns responses for one provider. You do not need production credentials.

1. Clone the registry.

```bash
git clone https://github.com/jsj/api-emulator-registry.git
cd api-emulator-registry
```

2. Start the PostHog emulator.

```bash
npx -p api-emulator api \
  --plugin ./providers/@posthog/api-emulator.mjs \
  --service posthog
```

The PostHog emulator starts at `http://localhost:4000/posthog`.

3. Set the PostHog API host to `http://localhost:4000/posthog`.

4. Run your integration test.

5. Reset the emulator before the next test.

## Run multiple providers

If a test uses GitHub and Apple, start both emulators.

```bash
npx -p api-emulator api \
  --plugin ./providers/@github/api-emulator.mjs,./providers/@apple/api-emulator.mjs \
  --service github,apple
```

## Create test data

Generate a starter configuration for repeatable test data.

```bash
npx -p api-emulator api init \
  --plugin ./providers/@alpaca/api-emulator/src/index.ts \
  --service alpaca
```

## What the registry provides

An emulator can provide these functions:

- Store state across requests.
- Model object relationships and edge cases.
- Return provider-specific responses and errors.
- Reset all state between test scenarios.

`api-emulator` runs the local server. This registry contains the provider plugins.

```text
Your app, workflow, or agent
  ↓
api-emulator on localhost
  ↓
Provider plugins from this registry
```

## Fidelity tiers

Each provider README declares one fidelity tier:

- `contract-backed`: The provider has a conformance manifest and smoke tests or contract tests.
- `smoke-only`: The provider has a direct smoke test but does not have a conformance manifest.
- `stub`: The provider implements a starter API or health API.
- `generated fallback`: The provider has a generated API without smoke-test or conformance evidence.

## Provider layout

Each provider has a scoped folder under `providers/`.

```text
providers/@posthog/api-emulator.mjs
providers/@github/api-emulator.mjs
providers/@cloudflare/api-emulator/src/index.ts
```

Use the [`create-api-emulator-plugin`](./.agents/skills/create-api-emulator-plugin/SKILL.md) skill to create a provider.

## Fixtures

Export a fixture after a stateful run. Restore the fixture before another test.

```ts
const fixture = openai.exportFixture({ metadata: { name: "happy-path-chat" } })

openai.resetToFixture(fixture)
```

## Run the tests

Run all smoke tests and contract tests.

```bash
bun run smoke
```

Run one provider smoke test.

```bash
node ./providers/@posthog/smoke.mjs
```

## Support

Open an [issue](https://github.com/jsj/api-emulator-registry/issues/new/choose) for an error, missing endpoint, or provider request.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before you send a change.

## Providers

<!-- provider-wall:start -->
| Logo | Provider | Package | What it emulates |
| --- | --- | --- | --- |
| <img src="https://www.google.com/s2/favicons?domain=xbow.com&sz=64" width="32" height="32" alt=""> | [Xbow](./providers/@xbow/api-emulator/README.md) | `@api-emulator/xbow` | Automated penetration-testing: organizations, assets, assessments, findings, reports, resources, and webhooks. |
| <img src="https://www.google.com/s2/favicons?domain=plaid.com&sz=64" width="32" height="32" alt=""> | [Plaid](./providers/@plaid/api-emulator/README.md) | `@api-emulator/plaid` | Financial: Link, accounts, balances, identity, transactions, institutions, auth, and transfer workflows. |
| <img src="https://www.google.com/s2/favicons?domain=modal.com&sz=64" width="32" height="32" alt=""> | [Modal](./providers/@modal/api-emulator/README.md) | `@api-emulator/modal` | Serverless Python compute control-plane: apps, environments, secrets, volumes, workspaces, and tokens. |
| <img src="https://www.google.com/s2/favicons?domain=replicate.com&sz=64" width="32" height="32" alt=""> | [Replicate](./providers/@replicate/api-emulator/README.md) | `@api-emulator/replicate` | Model metadata and deterministic prediction APIs with local image and video outputs. |
| <img src="https://www.google.com/s2/favicons?domain=github.com&sz=64" width="32" height="32" alt=""> | [GitHub](./providers/@github/api-emulator/README.md) | `@api-emulator/github` | Source hosting, repositories, issues, pull requests, Actions, checks, and git data. |
| <img src="https://www.google.com/s2/favicons?domain=adp.com&sz=64" width="32" height="32" alt=""> | [ADP](./providers/@adp/api-emulator/README.md) | `@api-emulator/adp` | Human Capital Management: workers, payroll events, organizations, time, and pay data. |
| <img src="https://www.google.com/s2/favicons?domain=agentcard.com&sz=64" width="32" height="32" alt=""> | [Agentcard](./providers/@agentcard/api-emulator/README.md) | `@api-emulator/agentcard` | Virtual card: CLI auth, payment methods, card creation, balances, and more. |
| <img src="https://www.google.com/s2/favicons?domain=agentmail.com&sz=64" width="32" height="32" alt=""> | [Agentmail](./providers/@agentmail/api-emulator/README.md) | `@api-emulator/agentmail` | Email inbox: agent inbox provisioning, message listing, sending, and threaded replies. |
| <img src="https://www.google.com/s2/favicons?domain=alibabacloud.com&sz=64" width="32" height="32" alt=""> | [Alibaba Cloud](./providers/@alibaba-cloud/api-emulator/README.md) | `@api-emulator/alibaba-cloud` | ECS RPC: regions, zones, VPCs, compute instances, and lifecycle actions. |
| <img src="https://www.google.com/s2/favicons?domain=alphavantage.com&sz=64" width="32" height="32" alt=""> | [Alpha Vantage](./providers/@alpha-vantage/api-emulator/README.md) | `@api-emulator/alpha-vantage` | Stock quote, time series, symbol search, and market status data through a query-parameter API. |
| <img src="https://www.google.com/s2/favicons?domain=sell.amazon.com&sz=64" width="32" height="32" alt=""> | [Amazon Seller](./providers/@amazon-seller/api-emulator/README.md) | `@api-emulator/amazon-seller` | Seller marketplace, orders, inventory, and restricted data token workflows. |
| <img src="https://www.google.com/s2/favicons?domain=anotes.com&sz=64" width="32" height="32" alt=""> | [Anotes](./providers/@anotes/api-emulator/README.md) | `@api-emulator/anotes` | A stateful Apple Notes fakout API plus deterministic NoteStore.sqlite fixtures for testing note bodies, folders, search, JSON-RPC, and more. |
| <img src="https://www.google.com/s2/favicons?domain=apple.com&sz=64" width="32" height="32" alt=""> | [Apple](./providers/@apple/api-emulator/README.md) | `@api-emulator/apple` | Sign in with Apple, CloudKit/iCloud app data, APNs, device, and more. |
| <img src="https://www.google.com/s2/favicons?domain=apple.com&sz=64" width="32" height="32" alt=""> | [Apple ADS](./providers/@apple-ads/api-emulator/README.md) | `@api-emulator/apple-ads` | Campaign management, reporting, recommendations, search popularity, account management, and change history. |
| <img src="https://www.google.com/s2/favicons?domain=maps.apple.com&sz=64" width="32" height="32" alt=""> | [Apple Maps](./providers/@apple-maps/api-emulator/README.md) | `@api-emulator/apple-maps` | Map tokens, search, geocoding, and reverse geocoding for location-aware apps. |
| <img src="https://www.google.com/s2/favicons?domain=apple.com&sz=64" width="32" height="32" alt=""> | [Apple Media](./providers/@apple-media/api-emulator/README.md) | `@api-emulator/apple-media` | ITunes Search, App Store storefront metadata, Apple Books audiobook charts, RSS feeds, and more. |
| <img src="https://www.google.com/s2/favicons?domain=music.apple.com&sz=64" width="32" height="32" alt=""> | [Apple Music](./providers/@apple-music/api-emulator/README.md) | `@api-emulator/apple-music` | MusicKit and iTunes Search: catalog search, songs, albums, artists, library playlists, and playlist tracks. |
| <img src="https://www.google.com/s2/favicons?domain=podcasts.apple.com&sz=64" width="32" height="32" alt=""> | [Apple Podcasts](./providers/@apple-podcasts/api-emulator/README.md) | `@api-emulator/apple-podcasts` | ITunes Search-compatible podcast search, lookup, episode, catalog, and library subscription workflows. |
| <img src="https://www.google.com/s2/favicons?domain=applecare.com&sz=64" width="32" height="32" alt=""> | [AppleCare](./providers/@applecare/api-emulator/README.md) | `@api-emulator/applecare` | Organization device inventory, warranty coverage, service eligibility, and repair case workflows. |
| <img src="https://www.google.com/s2/favicons?domain=applovin.com&sz=64" width="32" height="32" alt=""> | [Applovin](./providers/@applovin/api-emulator/README.md) | `@api-emulator/applovin` | Marketing and reporting: campaigns, ads, revenue, spend, and performance metrics. |
| <img src="https://www.google.com/s2/favicons?domain=argo.com&sz=64" width="32" height="32" alt=""> | [Argo](./providers/@argo/api-emulator/README.md) | `@api-emulator/argo` | Workflow orchestration: submitting, listing, inspecting, and deleting Kubernetes-native workflows. |
| <img src="https://www.google.com/s2/favicons?domain=arxiv.org&sz=64" width="32" height="32" alt=""> | [arXiv](./providers/@arxiv/api-emulator/README.md) | `@api-emulator/arxiv` | Atom feed: scholarly paper search, metadata retrieval, and offset pagination workflows. |
| <img src="https://www.google.com/s2/favicons?domain=attio.com&sz=64" width="32" height="32" alt=""> | [Attio](./providers/@attio/api-emulator/README.md) | `@api-emulator/attio` | CRM: workspace identity, objects, attributes, records, searches, and lists. |
| <img src="https://www.google.com/s2/favicons?domain=audible.com&sz=64" width="32" height="32" alt=""> | [Audible](./providers/@audible/api-emulator/README.md) | `@api-emulator/audible` | Audiobook catalog, library, review, and wishlist API surfaces for local client compatibility tests. |
| <img src="https://www.google.com/s2/favicons?domain=azure.microsoft.com&sz=64" width="32" height="32" alt=""> | [Azure](./providers/@azure/api-emulator/README.md) | `@api-emulator/azure` | Cloud resource: subscriptions, resource groups, deployments, and managed resources. |
| <img src="https://www.google.com/s2/favicons?domain=backblaze.com&sz=64" width="32" height="32" alt=""> | [Backblaze](./providers/@backblaze/api-emulator/README.md) | `@api-emulator/backblaze` | Cloud storage: account authorization, bucket management, and object storage workflows. |
| <img src="https://www.google.com/s2/favicons?domain=bilt.com&sz=64" width="32" height="32" alt=""> | [Bilt](./providers/@bilt/api-emulator/README.md) | `@api-emulator/bilt` | Member profiles, rewards accounts, points ledger, and rent payment workflows. |
| <img src="https://www.google.com/s2/favicons?domain=bland.com&sz=64" width="32" height="32" alt=""> | [Bland](./providers/@bland/api-emulator/README.md) | `@api-emulator/bland` | Voice AI: account details, outbound calls, call logs, pathways, and agent tools. |
| <img src="https://www.google.com/s2/favicons?domain=brex.com&sz=64" width="32" height="32" alt=""> | [Brex](./providers/@brex/api-emulator/README.md) | `@api-emulator/brex` | Spend-management: vendors, users, payments, and team workflows. |
| <img src="https://www.google.com/s2/favicons?domain=canvas.com&sz=64" width="32" height="32" alt=""> | [Canvas](./providers/@canvas/api-emulator/README.md) | `@api-emulator/canvas` | Education: users, courses, assignments, enrollments, submissions, and learning workflows. |
| <img src="https://www.google.com/s2/favicons?domain=coderabbit.com&sz=64" width="32" height="32" alt=""> | [CodeRabbit](./providers/@coderabbit/api-emulator/README.md) | `@api-emulator/coderabbit` | Code-review automation: users, seats, roles, review metrics, and audit logs. |
| <img src="https://www.google.com/s2/favicons?domain=coinbase.com&sz=64" width="32" height="32" alt=""> | [Coinbase](./providers/@coinbase/api-emulator/README.md) | `@api-emulator/coinbase` | Market products, account balances, historical orders, and order preview workflows. |
| <img src="https://www.google.com/s2/favicons?domain=concur.com&sz=64" width="32" height="32" alt=""> | [Concur](./providers/@concur/api-emulator/README.md) | `@api-emulator/concur` | Travel and expense: users, expense reports, entries, receipts, and travel requests. |
| <img src="https://www.google.com/s2/favicons?domain=congress.com&sz=64" width="32" height="32" alt=""> | [Congress](./providers/@congress/api-emulator/README.md) | `@api-emulator/congress` | Bill listing and bill detail: legislative research workflows. |
| <img src="https://www.google.com/s2/favicons?domain=context.com&sz=64" width="32" height="32" alt=""> | [Context](./providers/@context/api-emulator/README.md) | `@api-emulator/context` | Brand intelligence, web scraping, extraction, industry classification, and transaction enrichment APIs. |
| <img src="https://www.google.com/s2/favicons?domain=coreweave.com&sz=64" width="32" height="32" alt=""> | [CoreWeave](./providers/@coreweave/api-emulator/README.md) | `@api-emulator/coreweave` | Kubernetes Service: CKS clusters, regions, node types, and kubeconfig workflows. |
| <img src="https://www.google.com/s2/favicons?domain=courtlistener.com&sz=64" width="32" height="32" alt=""> | [Courtlistener](./providers/@courtlistener/api-emulator/README.md) | `@api-emulator/courtlistener` | Legal search, docket, and RECAP document: court and litigation research workflows. |
| <img src="https://www.google.com/s2/favicons?domain=craigslist.org&sz=64" width="32" height="32" alt=""> | [Craigslist](./providers/@craigslist/api-emulator/README.md) | `@api-emulator/craigslist` | Bulkpost OpenAPI surfaces for OAuth, billing, account messages, posting stats, and more. |
| <img src="https://www.google.com/s2/favicons?domain=crusoe.com&sz=64" width="32" height="32" alt=""> | [Crusoe](./providers/@crusoe/api-emulator/README.md) | `@api-emulator/crusoe` | Cloud infrastructure: projects, GPU instance types, virtual machines, SSH keys, and operations. |
| <img src="https://www.google.com/s2/favicons?domain=databricks.com&sz=64" width="32" height="32" alt=""> | [Databricks](./providers/@databricks/api-emulator/README.md) | `@api-emulator/databricks` | Workspace, cluster, job, run, SQL warehouse, and SQL statement: lakehouse automation. |
| <img src="https://www.google.com/s2/favicons?domain=datadog.com&sz=64" width="32" height="32" alt=""> | [Datadog](./providers/@datadog/api-emulator/README.md) | `@api-emulator/datadog` | Observability: metrics, monitors, logs, traces, hosts, dashboards, and events. |
| <img src="https://www.google.com/s2/favicons?domain=decagon.ai&sz=64" width="32" height="32" alt=""> | [Decagon](./providers/@decagon/api-emulator/README.md) | `@api-emulator/decagon` | AI customer-support: outbound chat messages and support automation workflows. |
| <img src="https://www.google.com/s2/favicons?domain=deel.com&sz=64" width="32" height="32" alt=""> | [Deel](./providers/@deel/api-emulator/README.md) | `@api-emulator/deel` | Workforce: people, legal entities, contracts, invoices, roles, and organization structures. |
| <img src="https://www.google.com/s2/favicons?domain=devin.com&sz=64" width="32" height="32" alt=""> | [Devin](./providers/@devin/api-emulator/README.md) | `@api-emulator/devin` | AI engineering agent: sessions, messages, PR reviews, users, and knowledge notes. |
| <img src="https://www.google.com/s2/favicons?domain=digitalocean.com&sz=64" width="32" height="32" alt=""> | [DigitalOcean](./providers/@digitalocean/api-emulator/README.md) | `@api-emulator/digitalocean` | Cloud infrastructure: accounts, projects, droplets, networking, and managed resources. |
| <img src="https://www.google.com/s2/favicons?domain=docusign.com&sz=64" width="32" height="32" alt=""> | [Docusign](./providers/@docusign/api-emulator/README.md) | `@api-emulator/docusign` | ESignature: OAuth userinfo, users, templates, envelopes, recipients, and Connect webhooks. |
| <img src="https://www.google.com/s2/favicons?domain=doordash.com&sz=64" width="32" height="32" alt=""> | [DoorDash](./providers/@doordash/api-emulator/README.md) | `@api-emulator/doordash` | Drive, Drive Classic, Developer, and Marketplace: delivery quotes, and more. |
| <img src="https://www.google.com/s2/favicons?domain=doppler.com&sz=64" width="32" height="32" alt=""> | [Doppler](./providers/@doppler/api-emulator/README.md) | `@api-emulator/doppler` | Secrets management: projects, configs, secret reads, and secret downloads. |
| <img src="https://www.google.com/s2/favicons?domain=dukeenergy.com&sz=64" width="32" height="32" alt=""> | [Duke Energy](./providers/@duke-energy/api-emulator/README.md) | `@api-emulator/duke-energy` | Auth0 token exchange, account lists, account details, balances, meters, and usage graph workflows. |
| <img src="https://www.google.com/s2/favicons?domain=etrade.com&sz=64" width="32" height="32" alt=""> | [E Trade](./providers/@e-trade/api-emulator/README.md) | `@api-emulator/e-trade` | Brokerage: OAuth 1.0a authorization, accounts, balances, portfolios, market quotes, orders, and order previews. |
| <img src="https://www.google.com/s2/favicons?domain=ebay.com&sz=64" width="32" height="32" alt=""> | [Ebay Seller](./providers/@ebay-seller/api-emulator/README.md) | `@api-emulator/ebay-seller` | OAuth, inventory item, offer, and marketplace selling workflows. |
| <img src="https://www.google.com/s2/favicons?domain=eia.com&sz=64" width="32" height="32" alt=""> | [EIA](./providers/@eia/api-emulator/README.md) | `@api-emulator/eia` | Energy fundamentals data routes for oil, gas, power, and inventory-sensitive workflows. |
| <img src="https://www.google.com/s2/favicons?domain=eightsleep.com&sz=64" width="32" height="32" alt=""> | [Eight Sleep](./providers/@eight-sleep/api-emulator/README.md) | `@api-emulator/eight-sleep` | Health and smart-bed: user profiles, devices, sleep trends, biometric intervals, and temperature control. |
| <img src="https://www.google.com/s2/favicons?domain=ethos.com&sz=64" width="32" height="32" alt=""> | [Ethos](./providers/@ethos/api-emulator/README.md) | `@api-emulator/ethos` | Partner lead intake, term-life quotes, application decisions, and policy workflows. |
| <img src="https://www.google.com/s2/favicons?domain=messenger.com&sz=64" width="32" height="32" alt=""> | [Facebook Messenger](./providers/@facebook-messenger/api-emulator/README.md) | `@api-emulator/facebook-messenger` | Graph API surfaces for pages, conversations, Send API messages, user profiles, and webhooks. |
| <img src="https://www.google.com/s2/favicons?domain=fidelity.com&sz=64" width="32" height="32" alt=""> | [Fidelity](./providers/@fidelity/api-emulator/README.md) | `@api-emulator/fidelity` | Workplace participant, retirement, stock-plan, HSA balance, and pay statement APIs. |
| <img src="https://www.google.com/s2/favicons?domain=figma.com&sz=64" width="32" height="32" alt=""> | [Figma](./providers/@figma/api-emulator/README.md) | `@api-emulator/figma` | REST: user identity, design files, image rendering, comments, teams, and collaboration workflows. |
| <img src="https://www.google.com/s2/favicons?domain=financialdatasets.com&sz=64" width="32" height="32" alt=""> | [Financialdatasets](./providers/@financialdatasets/api-emulator/README.md) | `@api-emulator/financialdatasets` | Stock prices, company facts, financial statements, SEC filings, news, and macro interest-rate APIs. |
| <img src="https://www.google.com/s2/favicons?domain=finnhub.com&sz=64" width="32" height="32" alt=""> | [Finnhub](./providers/@finnhub/api-emulator/README.md) | `@api-emulator/finnhub` | Financial market data: market news, company news, symbols, quotes, and fundamentals. |
| <img src="https://www.google.com/s2/favicons?domain=flightradar24.com&sz=64" width="32" height="32" alt=""> | [Flightradar24](./providers/@flightradar24/api-emulator/README.md) | `@api-emulator/flightradar24` | Live and historic flight positions, airport and airline lookup, flight summary, and track workflows. |
| <img src="https://www.google.com/s2/favicons?domain=gcp.com&sz=64" width="32" height="32" alt=""> | [GCP](./providers/@gcp/api-emulator/README.md) | `@api-emulator/gcp` | Cloud resource, compute, service usage, billing, IAM, and gcloud-oriented infrastructure APIs. |
| <img src="https://www.google.com/s2/favicons?domain=geico.com&sz=64" width="32" height="32" alt=""> | [Geico](./providers/@geico/api-emulator/README.md) | `@api-emulator/geico` | Customer, auto policy, claim, billing, and quote workflows. |
| <img src="https://www.google.com/s2/favicons?domain=gitlab.com&sz=64" width="32" height="32" alt=""> | [Gitlab](./providers/@gitlab/api-emulator/README.md) | `@api-emulator/gitlab` | Source hosting: users, projects, issues, merge requests, discussions, notes, and iterations. |
| <img src="https://www.google.com/s2/favicons?domain=classroom.google.com&sz=64" width="32" height="32" alt=""> | [Google Classroom](./providers/@google-classroom/api-emulator/README.md) | `@api-emulator/google-classroom` | Course, roster, teacher, student, and coursework: education workflows. |
| <img src="https://www.google.com/s2/favicons?domain=forms.google.com&sz=64" width="32" height="32" alt=""> | [Google Forms](./providers/@google-forms/api-emulator/README.md) | `@api-emulator/google-forms` | Form creation, form retrieval, batch updates, and response read: Workspace survey workflows. |
| <img src="https://www.google.com/s2/favicons?domain=maps.google.com&sz=64" width="32" height="32" alt=""> | [Google Maps](./providers/@google-maps/api-emulator/README.md) | `@api-emulator/google-maps` | Text search, nearby search, autocomplete, details, and field-mask workflows. |
| <img src="https://www.google.com/s2/favicons?domain=play.google.com&sz=64" width="32" height="32" alt=""> | [Google Play](./providers/@google-play/api-emulator/README.md) | `@api-emulator/google-play` | Android Publisher and Play Developer Reporting: tracks, reviews, products, subscriptions, and vitals. |
| <img src="https://www.google.com/s2/favicons?domain=govinfo.com&sz=64" width="32" height="32" alt=""> | [Govinfo](./providers/@govinfo/api-emulator/README.md) | `@api-emulator/govinfo` | Package collection, summary, and content: official U.S. government publications. |
| <img src="https://www.google.com/s2/favicons?domain=grafana.com&sz=64" width="32" height="32" alt=""> | [Grafana](./providers/@grafana/api-emulator/README.md) | `@api-emulator/grafana` | Observability dashboard: organizations, datasources, folders, dashboard search, and dashboard management. |
| <img src="https://www.google.com/s2/favicons?domain=greptile.com&sz=64" width="32" height="32" alt=""> | [Greptile](./providers/@greptile/api-emulator/README.md) | `@api-emulator/greptile` | AI codebase indexing, semantic search, and repository question-answering APIs. |
| <img src="https://www.google.com/s2/favicons?domain=gusto.com&sz=64" width="32" height="32" alt=""> | [Gusto](./providers/@gusto/api-emulator/README.md) | `@api-emulator/gusto` | Payroll and HR: companies, employees, contractors, payrolls, benefits, and onboarding. |
| <img src="https://www.google.com/s2/favicons?domain=harvey.com&sz=64" width="32" height="32" alt=""> | [Harvey](./providers/@harvey/api-emulator/README.md) | `@api-emulator/harvey` | Legal AI: vault projects, documents, search, and legal-grade completions. |
| <img src="https://www.google.com/s2/favicons?domain=vaultproject.io&sz=64" width="32" height="32" alt=""> | [Hashicorp Vault](./providers/@hashicorp-vault/api-emulator/README.md) | `@api-emulator/hashicorp-vault` | Secrets-management: health checks, mounts, and KV v2 secret read/write/list workflows. |
| <img src="https://www.google.com/s2/favicons?domain=hubspot.com&sz=64" width="32" height="32" alt=""> | [Hubspot](./providers/@hubspot/api-emulator/README.md) | `@api-emulator/hubspot` | CRM and developer: accounts, contacts, companies, deals, properties, CMS tables, files, and secrets. |
| <img src="https://www.google.com/s2/favicons?domain=huggingface.co&sz=64" width="32" height="32" alt=""> | [Huggingface](./providers/@huggingface/api-emulator/README.md) | `@api-emulator/huggingface` | Hub: users, models, datasets, Spaces, repository metadata, files, OAuth, and repo creation workflows. |
| <img src="https://www.google.com/s2/favicons?domain=apple.com&sz=64" width="32" height="32" alt=""> | [iMessage](./providers/@imsg/api-emulator/README.md) | `@api-emulator/imsg` | A stateful iMessage fakout API plus deterministic macOS Messages chat.db fixtures for testing chats, history, search, send, and more. |
| <img src="https://www.google.com/s2/favicons?domain=interactivebrokers.com&sz=64" width="32" height="32" alt=""> | [Interactive Brokers](./providers/@interactive-brokers/api-emulator/README.md) | `@api-emulator/interactive-brokers` | Session, accounts, portfolio, market data, contract search, and order workflows. |
| <img src="https://www.google.com/s2/favicons?domain=intercom.com&sz=64" width="32" height="32" alt=""> | [Intercom](./providers/@intercom/api-emulator/README.md) | `@api-emulator/intercom` | Customer-support: admins, contacts, conversations, replies, and inbox workflows. |
| <img src="https://www.google.com/s2/favicons?domain=intuit.com&sz=64" width="32" height="32" alt=""> | [Intuit](./providers/@intuit/api-emulator/README.md) | `@api-emulator/intuit` | Accounting: OAuth, company info, query, customers, invoices, payments, and accounts. |
| <img src="https://www.google.com/s2/favicons?domain=atlassian.com&sz=64" width="32" height="32" alt=""> | [Jira](./providers/@jira/api-emulator/README.md) | `@api-emulator/jira` | Issue tracking: users, projects, issues, search, and workflow-oriented project management. |
| <img src="https://www.google.com/s2/favicons?domain=joinwarp.com&sz=64" width="32" height="32" alt=""> | [Joinwarp Payroll](./providers/@joinwarp-payroll/api-emulator/README.md) | `@api-emulator/joinwarp-payroll` | Workforce: departments, workplaces, workers, invitations, and time-off records. |
| <img src="https://www.google.com/s2/favicons?domain=legalzoom.com&sz=64" width="32" height="32" alt=""> | [Legalzoom](./providers/@legalzoom/api-emulator/README.md) | `@api-emulator/legalzoom` | Legal-services workflows for customers, products, orders, business formations, and generated documents. |
| <img src="https://www.google.com/s2/favicons?domain=legora.com&sz=64" width="32" height="32" alt=""> | [Legora](./providers/@legora/api-emulator/README.md) | `@api-emulator/legora` | Legal workspace: matters, documents, workflows, review tables, and AI completions. |
| <img src="https://www.google.com/s2/favicons?domain=lemma.com&sz=64" width="32" height="32" alt=""> | [Lemma](./providers/@lemma/api-emulator/README.md) | `@api-emulator/lemma` | Agent trace ingestion and ingest-status: local observability workflows. |
| <img src="https://www.google.com/s2/favicons?domain=lemonade.com&sz=64" width="32" height="32" alt=""> | [Lemonade](./providers/@lemonade/api-emulator/README.md) | `@api-emulator/lemonade` | Customer, renters quote, policy binding, and claim workflows. |
| <img src="https://www.google.com/s2/favicons?domain=lexisnexis.com&sz=64" width="32" height="32" alt=""> | [Lexis](./providers/@lexis/api-emulator/README.md) | `@api-emulator/lexis` | Legal research: sources, search, documents, folders, and Web Services API-compatible aliases. |
| <img src="https://www.google.com/s2/favicons?domain=lightreel.com&sz=64" width="32" height="32" alt=""> | [Lightreel](./providers/@lightreel/api-emulator/README.md) | `@api-emulator/lightreel` | Chat: social media research questions, structured agent answers, and API chat transcripts. |
| <img src="https://www.google.com/s2/favicons?domain=linkedin.com&sz=64" width="32" height="32" alt=""> | [LinkedIn](./providers/@linkedin/api-emulator/README.md) | `@api-emulator/linkedin` | Profile, organization, posting, advertising, analytics, and OAuth: professional network workflows. |
| <img src="https://www.google.com/s2/favicons?domain=linq.com&sz=64" width="32" height="32" alt=""> | [Linq](./providers/@linq/api-emulator/README.md) | `@api-emulator/linq` | IMessage, RCS, and SMS chats, messages, phone numbers, and webhook subscriptions. |
| <img src="https://www.google.com/s2/favicons?domain=listenlabs.com&sz=64" width="32" height="32" alt=""> | [Listenlabs](./providers/@listenlabs/api-emulator/README.md) | `@api-emulator/listenlabs` | AI research: studies, questions, participant responses, transcripts, summaries, and research insights. |
| <img src="https://www.google.com/s2/favicons?domain=lucent.com&sz=64" width="32" height="32" alt=""> | [Lucent](./providers/@lucent/api-emulator/README.md) | `@api-emulator/lucent` | Session replay SDK: public-key validation, browser replay ingestion, and session capture workflows. |
| <img src="https://www.google.com/s2/favicons?domain=marketo.com&sz=64" width="32" height="32" alt=""> | [Marketo](./providers/@marketo/api-emulator/README.md) | `@api-emulator/marketo` | REST: OAuth, leads, lead upserts, programs, lists, and marketing assets. |
| <img src="https://www.google.com/s2/favicons?domain=mediawiki.org&sz=64" width="32" height="32" alt=""> | [Mediawiki](./providers/@mediawiki/api-emulator/README.md) | `@api-emulator/mediawiki` | Action API and page summary: Wikipedia, Wikimedia Commons, Wiktionary, Wikidata, and Fandom-style wiki workflows. |
| <img src="https://www.google.com/s2/favicons?domain=mercury.com&sz=64" width="32" height="32" alt=""> | [Mercury](./providers/@mercury/api-emulator/README.md) | `@api-emulator/mercury` | Banking: accounts, transactions, recipients, and payment approval workflows. |
| <img src="https://www.google.com/s2/favicons?domain=metlife.com&sz=64" width="32" height="32" alt=""> | [Metlife](./providers/@metlife/api-emulator/README.md) | `@api-emulator/metlife` | Needs analysis, product recommendation, quote illustration, and life application submission workflows. |
| <img src="https://www.google.com/s2/favicons?domain=mintlify.com&sz=64" width="32" height="32" alt=""> | [Mintlify](./providers/@mintlify/api-emulator/README.md) | `@api-emulator/mintlify` | Documentation deployment, preview, assistant, search, page content, and analytics APIs. |
| <img src="https://www.google.com/s2/favicons?domain=mobbin.com&sz=64" width="32" height="32" alt=""> | [Mobbin](./providers/@mobbin/api-emulator/README.md) | `@api-emulator/mobbin` | MCP and Screens Search: discovering mobile and web design reference screens. |
| <img src="https://www.google.com/s2/favicons?domain=nytimes.com&sz=64" width="32" height="32" alt=""> | [New York Times](./providers/@nytimes/api-emulator/README.md) | `@api-emulator/nytimes` | Article search, archive, top stories, books, and public content datasets. |
| <img src="https://www.google.com/s2/favicons?domain=nextdoor.com&sz=64" width="32" height="32" alt=""> | [Nextdoor](./providers/@nextdoor/api-emulator/README.md) | `@api-emulator/nextdoor` | Neighborhood social: member profiles, publishing posts, and local search workflows. |
| <img src="https://www.google.com/s2/favicons?domain=oracle.com&sz=64" width="32" height="32" alt=""> | [OCI](./providers/@oci/api-emulator/README.md) | `@api-emulator/oci` | Cloud: identity, regions, availability domains, compute instances, and networking. |
| <img src="https://www.google.com/s2/favicons?domain=oculus.com&sz=64" width="32" height="32" alt=""> | [Oculus](./providers/@oculus/api-emulator/README.md) | `@api-emulator/oculus` | Graph API surfaces for app builds, release channels, redists, and platform utility workflows. |
| <img src="https://www.google.com/s2/favicons?domain=openfda.com&sz=64" width="32" height="32" alt=""> | [Openfda](./providers/@openfda/api-emulator/README.md) | `@api-emulator/openfda` | Drug event, enforcement, label, Drugs@FDA, and shortage: healthcare and regulatory workflows. |
| <img src="https://www.google.com/s2/favicons?domain=opentable.com&sz=64" width="32" height="32" alt=""> | [Opentable](./providers/@opentable/api-emulator/README.md) | `@api-emulator/opentable` | OAuth and Consumer API v2 booking: availability, slot locks, reservations, modification, and cancellation. |
| <img src="https://www.google.com/s2/favicons?domain=oura.com&sz=64" width="32" height="32" alt=""> | [Oura](./providers/@oura/api-emulator/README.md) | `@api-emulator/oura` | Health: personal info, daily sleep, readiness, activity, workouts, and heart-rate data. |
| <img src="https://www.google.com/s2/favicons?domain=patreon.com&sz=64" width="32" height="32" alt=""> | [Patreon](./providers/@patreon/api-emulator/README.md) | `@api-emulator/patreon` | JSON:API resources for OAuth, identity, campaigns, members, posts, and webhooks. |
| <img src="https://www.google.com/s2/favicons?domain=paypal.com&sz=64" width="32" height="32" alt=""> | [Paypal](./providers/@paypal/api-emulator/README.md) | `@api-emulator/paypal` | Payments: OAuth, checkout orders, captures, refunds, webhooks, and transaction workflows. |
| <img src="https://www.google.com/s2/favicons?domain=pinterest.com&sz=64" width="32" height="32" alt=""> | [Pinterest](./providers/@pinterest/api-emulator/README.md) | `@api-emulator/pinterest` | User account, board, and pin creation/listing workflows. |
| <img src="https://www.google.com/s2/favicons?domain=playstation.com&sz=64" width="32" height="32" alt=""> | [Playstation](./providers/@playstation/api-emulator/README.md) | `@api-emulator/playstation` | Content Pipeline concepts, products, variants, assets, and publish history workflows. |
| <img src="https://www.google.com/s2/favicons?domain=postbridge.com&sz=64" width="32" height="32" alt=""> | [Postbridge](./providers/@postbridge/api-emulator/README.md) | `@api-emulator/postbridge` | Social media scheduling: connected accounts, draft posts, scheduled posts, and publishing. |
| <img src="https://www.google.com/s2/favicons?domain=music.amazon.com&sz=64" width="32" height="32" alt=""> | [Prime Music](./providers/@prime-music/api-emulator/README.md) | `@api-emulator/prime-music` | Amazon Music-compatible: catalog search, tracks, albums, playlists, library saves, and playback controls. |
| <img src="https://www.google.com/s2/favicons?domain=progressive.com&sz=64" width="32" height="32" alt=""> | [Progressive](./providers/@progressive/api-emulator/README.md) | `@api-emulator/progressive` | Auto quotes, policy servicing, customer, and claim workflows. |
| <img src="https://www.google.com/s2/favicons?domain=proton.me&sz=64" width="32" height="32" alt=""> | [Proton Mail](./providers/@proton-mail/api-emulator/README.md) | `@api-emulator/proton-mail` | Mail: labels, messages, mailbox state, and read/unread workflows. |
| <img src="https://www.google.com/s2/favicons?domain=qualtrics.com&sz=64" width="32" height="32" alt=""> | [Qualtrics](./providers/@qualtrics/api-emulator/README.md) | `@api-emulator/qualtrics` | Survey, survey definition, response, and response export: experience management workflows. |
| <img src="https://www.google.com/s2/favicons?domain=quizlet.com&sz=64" width="32" height="32" alt=""> | [Quizlet](./providers/@quizlet/api-emulator/README.md) | `@api-emulator/quizlet` | Education: users, study sets, terms, and flashcard creation workflows. |
| <img src="https://www.google.com/s2/favicons?domain=ramp.com&sz=64" width="32" height="32" alt=""> | [Ramp](./providers/@ramp/api-emulator/README.md) | `@api-emulator/ramp` | Finance: entities, users, corporate cards, transactions, reimbursements, bills, and spend controls. |
| <img src="https://www.google.com/s2/favicons?domain=reddit.com&sz=64" width="32" height="32" alt=""> | [Reddit](./providers/@reddit/api-emulator/README.md) | `@api-emulator/reddit` | OAuth, identity, subreddit, listing, post submission, and comment APIs. |
| <img src="https://www.google.com/s2/favicons?domain=reducto.com&sz=64" width="32" height="32" alt=""> | [Reducto](./providers/@reducto/api-emulator/README.md) | `@api-emulator/reducto` | Document parsing, extraction, splitting, upload, pipeline, webhook, and asynchronous job APIs. |
| <img src="https://www.google.com/s2/favicons?domain=render.com&sz=64" width="32" height="32" alt=""> | [Render](./providers/@render/api-emulator/README.md) | `@api-emulator/render` | Hosting control-plane: users, workspaces, services, and blueprint validation. |
| <img src="https://www.google.com/s2/favicons?domain=rentahuman.com&sz=64" width="32" height="32" alt=""> | [Rentahuman](./providers/@rentahuman/api-emulator/README.md) | `@api-emulator/rentahuman` | REST and MCP: agents, humans, bookings, bounties, and more. |
| <img src="https://www.google.com/s2/favicons?domain=replit.com&sz=64" width="32" height="32" alt=""> | [Replit](./providers/@replit/api-emulator/README.md) | `@api-emulator/replit` | Extension Data API and GraphQL surfaces for users, Repls, and extension public key workflows. |
| <img src="https://www.google.com/s2/favicons?domain=rippling.com&sz=64" width="32" height="32" alt=""> | [Rippling](./providers/@rippling/api-emulator/README.md) | `@api-emulator/rippling` | Workforce platform: employees, groups, departments, devices, payroll, and identity data. |
| <img src="https://www.google.com/s2/favicons?domain=robinhoodbanking.com&sz=64" width="32" height="32" alt=""> | [Robinhood Banking](./providers/@robinhood-banking/api-emulator/README.md) | `@api-emulator/robinhood-banking` | Local API. |
| <img src="https://www.google.com/s2/favicons?domain=robinhoodtrading.com&sz=64" width="32" height="32" alt=""> | [Robinhood Trading](./providers/@robinhood-trading/api-emulator/README.md) | `@api-emulator/robinhood-trading` | Account, portfolio, position, market data, and more. |
| <img src="https://www.google.com/s2/favicons?domain=rocketchat.com&sz=64" width="32" height="32" alt=""> | [Rocketchat](./providers/@rocketchat/api-emulator/README.md) | `@api-emulator/rocketchat` | Team chat: rooms, direct messages, group and channel history, room metadata, and message posting. |
| <img src="https://www.google.com/s2/favicons?domain=salesforce.com&sz=64" width="32" height="32" alt=""> | [Salesforce](./providers/@salesforce/api-emulator/README.md) | `@api-emulator/salesforce` | CRM: org identity, SOQL queries, object metadata, and sObject record workflows. |
| <img src="https://www.google.com/s2/favicons?domain=samsara.com&sz=64" width="32" height="32" alt=""> | [Samsara](./providers/@samsara/api-emulator/README.md) | `@api-emulator/samsara` | Connected operations: fleets, vehicles, drivers, routes, sensors, safety, and telematics. |
| <img src="https://www.google.com/s2/favicons?domain=schwab.com&sz=64" width="32" height="32" alt=""> | [Schwab](./providers/@schwab/api-emulator/README.md) | `@api-emulator/schwab` | OAuth, brokerage accounts, account hashes, orders, quotes, and option chain data. |
| <img src="https://www.google.com/s2/favicons?domain=sendblue.com&sz=64" width="32" height="32" alt=""> | [Sendblue](./providers/@sendblue/api-emulator/README.md) | `@api-emulator/sendblue` | IMessage, RCS, SMS, contacts, phone lines, and webhooks. |
| <img src="https://www.google.com/s2/favicons?domain=servicenow.com&sz=64" width="32" height="32" alt=""> | [ServiceNow](./providers/@servicenow/api-emulator/README.md) | `@api-emulator/servicenow` | Customer-support and ITSM: Table API incidents, users, groups, and workflow records. |
| <img src="https://www.google.com/s2/favicons?domain=setlistfm.com&sz=64" width="32" height="32" alt=""> | [Setlistfm](./providers/@setlistfm/api-emulator/README.md) | `@api-emulator/setlistfm` | Artist, venue, city, country, user, and setlist lookup and search APIs. |
| <img src="https://www.google.com/s2/favicons?domain=shazam.com&sz=64" width="32" height="32" alt=""> | [Shazam](./providers/@shazam/api-emulator/README.md) | `@api-emulator/shazam` | Recognition, song metadata, chart, search, and Apple Music link workflows. |
| <img src="https://www.google.com/s2/favicons?domain=shipstation.com&sz=64" width="32" height="32" alt=""> | [Shipstation](./providers/@shipstation/api-emulator/README.md) | `@api-emulator/shipstation` | Shipping: shipments, rates, labels, tracking, and fulfillment workflows. |
| <img src="https://www.google.com/s2/favicons?domain=shopify.com&sz=64" width="32" height="32" alt=""> | [Shopify](./providers/@shopify/api-emulator/README.md) | `@api-emulator/shopify` | Shop, products, orders, inventory, customers, and GraphQL commerce workflows. |
| <img src="https://www.google.com/s2/favicons?domain=sierra.com&sz=64" width="32" height="32" alt=""> | [Sierra](./providers/@sierra/api-emulator/README.md) | `@api-emulator/sierra` | AI customer-service agent SDK surfaces for mobile chat embeds, voice SVP transport probes, and conversation fixtures, and more. |
| <img src="https://www.google.com/s2/favicons?domain=signalmessaging.com&sz=64" width="32" height="32" alt=""> | [Signal Messaging](./providers/@signal-messaging/api-emulator/README.md) | `@api-emulator/signal-messaging` | Signal-cli-rest-api-compatible local messaging routes for registration, sending, receiving, and groups. |
| <img src="https://www.google.com/s2/favicons?domain=silurian.com&sz=64" width="32" height="32" alt=""> | [Silurian](./providers/@silurian/api-emulator/README.md) | `@api-emulator/silurian` | Weather forecasts, portfolio GeoJSON features, and cyclone forecast surfaces. |
| <img src="https://www.google.com/s2/favicons?domain=siriusxm.com&sz=64" width="32" height="32" alt=""> | [Siriusxm](./providers/@siriusxm/api-emulator/README.md) | `@api-emulator/siriusxm` | Channel lineup, now-playing metadata, recent track, profile, and favorite channel workflows. |
| <img src="https://www.google.com/s2/favicons?domain=skyscanner.com&sz=64" width="32" height="32" alt=""> | [Skyscanner](./providers/@skyscanner/api-emulator/README.md) | `@api-emulator/skyscanner` | Flights live search sessions, itinerary pricing, and refresh polling workflows. |
| <img src="https://www.google.com/s2/favicons?domain=snap.com&sz=64" width="32" height="32" alt=""> | [Snap](./providers/@snap/api-emulator/README.md) | `@api-emulator/snap` | Marketing API surfaces for OAuth, organizations, ad accounts, campaigns, ads, and reporting. |
| <img src="https://www.google.com/s2/favicons?domain=snappr.com&sz=64" width="32" height="32" alt=""> | [Snappr](./providers/@snappr/api-emulator/README.md) | `@api-emulator/snappr` | Visual-content: coverage, availability, photoshoot bookings, editing jobs, presets, and asset retrieval. |
| <img src="https://www.google.com/s2/favicons?domain=snowflake.com&sz=64" width="32" height="32" alt=""> | [Snowflake](./providers/@snowflake/api-emulator/README.md) | `@api-emulator/snowflake` | SQL API statement execution and REST resources for databases, schemas, warehouses, and users. |
| <img src="https://www.google.com/s2/favicons?domain=sourcegraph.com&sz=64" width="32" height="32" alt=""> | [Sourcegraph](./providers/@sourcegraph/api-emulator/README.md) | `@api-emulator/sourcegraph` | Code search, GraphQL, Cody context, and LLM model: developer tooling workflows. |
| <img src="https://www.google.com/s2/favicons?domain=spark.com&sz=64" width="32" height="32" alt=""> | [Spark](./providers/@spark/api-emulator/README.md) | `@api-emulator/spark` | Monitoring and standalone submission REST: applications, jobs, stages, executors, and drivers. |
| <img src="https://www.google.com/s2/favicons?domain=spectrum.com&sz=64" width="32" height="32" alt=""> | [Spectrum](./providers/@spectrum/api-emulator/README.md) | `@api-emulator/spectrum` | OAuth tokens, sites, circuits, tickets, notes, and attachments for B2B support workflows. |
| <img src="https://www.google.com/s2/favicons?domain=spotify.com&sz=64" width="32" height="32" alt=""> | [Spotify](./providers/@spotify/api-emulator/README.md) | `@api-emulator/spotify` | Web API surfaces for catalog search, tracks, albums, artists, and more. |
| <img src="https://www.google.com/s2/favicons?domain=stainless.com&sz=64" width="32" height="32" alt=""> | [Stainless](./providers/@stainless/api-emulator/README.md) | `@api-emulator/stainless` | SDK generation: projects, branches, configs, builds, diagnostics, and generated target outputs. |
| <img src="https://www.google.com/s2/favicons?domain=statefarm.com&sz=64" width="32" height="32" alt=""> | [Statefarm](./providers/@statefarm/api-emulator/README.md) | `@api-emulator/statefarm` | Renters quote, policy, claim, billing, and customer workflows. |
| <img src="https://www.google.com/s2/favicons?domain=steam.com&sz=64" width="32" height="32" alt=""> | [Steam](./providers/@steam/api-emulator/README.md) | `@api-emulator/steam` | Player summaries, owned games, achievements, news, and community data. |
| <img src="https://www.google.com/s2/favicons?domain=substack.com&sz=64" width="32" height="32" alt=""> | [Substack](./providers/@substack/api-emulator/README.md) | `@api-emulator/substack` | Publication metadata, newsletter posts, drafts, and subscribers. |
| <img src="https://www.google.com/s2/favicons?domain=suno.com&sz=64" width="32" height="32" alt=""> | [Suno](./providers/@suno/api-emulator/README.md) | `@api-emulator/suno` | Credits, asynchronous music generation tasks, record polling, and lyrics generation workflows. |
| <img src="https://www.google.com/s2/favicons?domain=surveymonkey.com&sz=64" width="32" height="32" alt=""> | [Surveymonkey](./providers/@surveymonkey/api-emulator/README.md) | `@api-emulator/surveymonkey` | API v3 surfaces for users, surveys, collectors, and bulk survey response workflows. |
| <img src="https://www.google.com/s2/favicons?domain=symbolab.com&sz=64" width="32" height="32" alt=""> | [Symbolab](./providers/@symbolab/api-emulator/README.md) | `@api-emulator/symbolab` | Equation solution, steps, answer verification, and graph plotting workflows. |
| <img src="https://www.google.com/s2/favicons?domain=ticketmaster.com&sz=64" width="32" height="32" alt=""> | [Ticketmaster](./providers/@ticketmaster/api-emulator/README.md) | `@api-emulator/ticketmaster` | Event, attraction, venue, classification, image, and suggest search APIs. |
| <img src="https://www.google.com/s2/favicons?domain=truemed.com&sz=64" width="32" height="32" alt=""> | [Truemed](./providers/@truemed/api-emulator/README.md) | `@api-emulator/truemed` | HSA/FSA payment: checkout sessions, payment tokens, qualification sessions, product catalog eligibility, and more. |
| <img src="https://www.google.com/s2/favicons?domain=tryprofound.com&sz=64" width="32" height="32" alt=""> | [Tryprofound](./providers/@tryprofound/api-emulator/README.md) | `@api-emulator/tryprofound` | AI search analytics: organizations, prompts, reports, agents, knowledge bases, and content optimization. |
| <img src="https://www.google.com/s2/favicons?domain=turbotax.com&sz=64" width="32" height="32" alt=""> | [Turbotax](./providers/@turbotax/api-emulator/README.md) | `@api-emulator/turbotax` | OAuth, tax document, and import session workflows for deterministic tax prep testing. |
| <img src="https://www.google.com/s2/favicons?domain=uber.com&sz=64" width="32" height="32" alt=""> | [Uber](./providers/@uber/api-emulator/README.md) | `@api-emulator/uber` | Rides, Direct, and Eats: profiles, products, and more. |
| <img src="https://www.google.com/s2/favicons?domain=uipath.com&sz=64" width="32" height="32" alt=""> | [Uipath](./providers/@uipath/api-emulator/README.md) | `@api-emulator/uipath` | OData workflows for folders, users, releases, jobs, queues, robots, and assets. |
| <img src="https://www.google.com/s2/favicons?domain=unity.com&sz=64" width="32" height="32" alt=""> | [Unity ADS](./providers/@unity-ads/api-emulator/README.md) | `@api-emulator/unity-ads` | Advertising Management, Advertising Statistics, and Monetization Stats: apps, campaigns, and ad performance reports. |
| <img src="https://www.google.com/s2/favicons?domain=usaa.com&sz=64" width="32" height="32" alt=""> | [USAA](./providers/@usaa/api-emulator/README.md) | `@api-emulator/usaa` | FDX account, customer, balance, and transaction data workflows. |
| <img src="https://www.google.com/s2/favicons?domain=uspto.com&sz=64" width="32" height="32" alt=""> | [Uspto](./providers/@uspto/api-emulator/README.md) | `@api-emulator/uspto` | Open Data Portal patent assignment and TSDR-compatible trademark status APIs. |
| <img src="https://www.google.com/s2/favicons?domain=developer.apple.com&sz=64" width="32" height="32" alt=""> | [Weatherkit](./providers/@weatherkit/api-emulator/README.md) | `@api-emulator/weatherkit` | Availability, current weather, forecasts, and weather alerts. |
| <img src="https://www.google.com/s2/favicons?domain=whatsapp.com&sz=64" width="32" height="32" alt=""> | [Whatsapp](./providers/@whatsapp/api-emulator/README.md) | `@api-emulator/whatsapp` | Graph API surfaces for business phone numbers, messages, media, templates, and webhooks. |
| <img src="https://www.google.com/s2/favicons?domain=whoop.com&sz=64" width="32" height="32" alt=""> | [Whoop](./providers/@whoop/api-emulator/README.md) | `@api-emulator/whoop` | Health: athlete profiles, body measurements, cycles, recovery, sleep, and workouts. |
| <img src="https://www.google.com/s2/favicons?domain=wikipedia.org&sz=64" width="32" height="32" alt=""> | [Wikipedia](./providers/@wikipedia/api-emulator/README.md) | `@api-emulator/wikipedia` | Wikimedia REST and MediaWiki Action API read surfaces for page summaries, search, extracts, and content retrieval, and more. |
| <img src="https://www.google.com/s2/favicons?domain=wolframalpha.com&sz=64" width="32" height="32" alt=""> | [Wolfram](./providers/@wolfram/api-emulator/README.md) | `@api-emulator/wolfram` | Short answers, full query results, spoken results, and LLM-ready computational answers. |
| <img src="https://www.google.com/s2/favicons?domain=workday.com&sz=64" width="32" height="32" alt=""> | [Workday](./providers/@workday/api-emulator/README.md) | `@api-emulator/workday` | Enterprise HR, finance, and planning: workers, organizations, jobs, reports, and business processes. |
| <img src="https://www.google.com/s2/favicons?domain=x.com&sz=64" width="32" height="32" alt=""> | [X](./providers/@x/api-emulator/README.md) | `@api-emulator/x` | OAuth, users, tweets, timelines, and social publishing workflows. |
| <img src="https://www.google.com/s2/favicons?domain=xads.com&sz=64" width="32" height="32" alt=""> | [X ADS](./providers/@x-ads/api-emulator/README.md) | `@api-emulator/x-ads` | Account, campaign, line-item, targeting, creative, and analytics tools with paused-by-default writes. |
| <img src="https://www.google.com/s2/favicons?domain=xbox.com&sz=64" width="32" height="32" alt=""> | [Xbox](./providers/@xbox/api-emulator/README.md) | `@api-emulator/xbox` | App submissions, flights, package metadata, and publish status workflows. |
| <img src="https://www.google.com/s2/favicons?domain=yahoofinance.com&sz=64" width="32" height="32" alt=""> | [Yahoo Finance](./providers/@yahoo-finance/api-emulator/README.md) | `@api-emulator/yahoo-finance` | Chart, quote, quote summary, and fundamentals time-series data used by yfinance. |
| <img src="https://www.google.com/s2/favicons?domain=youtube.com&sz=64" width="32" height="32" alt=""> | [Youtube](./providers/@youtube/api-emulator/README.md) | `@api-emulator/youtube` | Data API, Upload API, and Analytics API surfaces for creator posting, video management, and more. |
| <img src="https://www.google.com/s2/favicons?domain=music.youtube.com&sz=64" width="32" height="32" alt=""> | [Youtube Music](./providers/@youtube-music/api-emulator/README.md) | `@api-emulator/youtube-music` | InnerTube-style: search, browse, playback metadata, queues, playlists, likes, and subscriptions. |
| <img src="https://www.google.com/s2/favicons?domain=meta.com&sz=64" width="32" height="32" alt=""> | [Meta](./providers/@meta/api-emulator/README.md) | `@api-emulator/meta` | Local API. |
| <img src="https://www.google.com/s2/favicons?domain=piratebay.com&sz=64" width="32" height="32" alt=""> | [Piratebay](./providers/@piratebay/api-emulator/README.md) | `@api-emulator/piratebay` | Generic media index fixtures for search, item metadata, playback, and library-style workflows. |
| <img src="https://www.google.com/s2/favicons?domain=adyen.com&sz=64" width="32" height="32" alt=""> | [Adyen](./providers/@adyen/api-emulator/README.md) | `@api-emulator/adyen` | Checkout, payment methods, transaction processing, and payouts. |
| <img src="https://www.google.com/s2/favicons?domain=akamai.com&sz=64" width="32" height="32" alt=""> | [Akamai](./providers/@akamai/api-emulator/README.md) | `@api-emulator/akamai` | Edge delivery, security, DNS, and Akamai Cloud Manager infrastructure APIs. |
| <img src="https://www.google.com/s2/favicons?domain=alpaca.com&sz=64" width="32" height="32" alt=""> | [Alpaca](./providers/@alpaca/api-emulator/README.md) | `@api-emulator/alpaca` | Local API. |
| <img src="https://www.google.com/s2/favicons?domain=anthropic.com&sz=64" width="32" height="32" alt=""> | [Anthropic](./providers/@anthropic/api-emulator/README.md) | `@api-emulator/anthropic` | Local API. |
| <img src="https://www.google.com/s2/favicons?domain=appstoreconnect.apple.com&sz=64" width="32" height="32" alt=""> | [App Store Connect](./providers/@app-store-connect/api-emulator/README.md) | `@api-emulator/app-store-connect` | IOS and macOS app metadata, builds, TestFlight, review submissions, users, and app operations. |
| <img src="https://www.google.com/s2/favicons?domain=auth0.com&sz=64" width="32" height="32" alt=""> | [Auth0](./providers/@auth0/api-emulator/README.md) | `@api-emulator/auth0` | Authentication, authorization, user management, tokens, and tenant configuration. |
| <img src="https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=64" width="32" height="32" alt=""> | [AWS](./providers/@aws/api-emulator/README.md) | `@api-emulator/aws` | Cloud infrastructure: storage, queues, identity, compute, and managed services. |
| <img src="https://www.google.com/s2/favicons?domain=baseten.com&sz=64" width="32" height="32" alt=""> | [Baseten](./providers/@baseten/api-emulator/README.md) | `@api-emulator/baseten` | Model deployment, management, and inference APIs including OpenAI-compatible model endpoints. |
| <img src="https://www.google.com/s2/favicons?domain=brave.com&sz=64" width="32" height="32" alt=""> | [Brave Search](./providers/@brave-search/api-emulator/README.md) | `@api-emulator/brave-search` | Web, news, and suggestion search: agentic retrieval and SERP-style workflows. |
| <img src="https://www.google.com/s2/favicons?domain=browserbase.com&sz=64" width="32" height="32" alt=""> | [Browserbase](./providers/@browserbase/api-emulator/README.md) | `@api-emulator/browserbase` | Hosted browser sessions for web automation, scraping, and agent workflows. |
| <img src="https://www.google.com/s2/favicons?domain=bunny.com&sz=64" width="32" height="32" alt=""> | [Bunny](./providers/@bunny/api-emulator/README.md) | `@api-emulator/bunny` | CDN, edge storage, pull zone, DNS, and edge delivery APIs. |
| <img src="https://www.google.com/s2/favicons?domain=canva.com&sz=64" width="32" height="32" alt=""> | [Canva](./providers/@canva/api-emulator/README.md) | `@api-emulator/canva` | User, design, asset upload, import, and export workflows for Canva-integrated apps. |
| <img src="https://www.google.com/s2/favicons?domain=capcut.com&sz=64" width="32" height="32" alt=""> | [Capcut](./providers/@capcut/api-emulator/README.md) | `@api-emulator/capcut` | Video automation workflows. |
| <img src="https://www.google.com/s2/favicons?domain=clay.com&sz=64" width="32" height="32" alt=""> | [Clay](./providers/@clay/api-emulator/README.md) | `@api-emulator/clay` | APIs and webhook surfaces for sales intelligence tables, rows, enrichments, and workflows. |
| <img src="https://www.google.com/s2/favicons?domain=clerk.com&sz=64" width="32" height="32" alt=""> | [Clerk](./providers/@clerk/api-emulator/README.md) | `@api-emulator/clerk` | User authentication, sessions, organizations, OAuth, and identity-management primitives. |
| <img src="https://www.google.com/s2/favicons?domain=cloudflare.com&sz=64" width="32" height="32" alt=""> | [Cloudflare](./providers/@cloudflare/api-emulator/README.md) | `@api-emulator/cloudflare` | Local API. |
| <img src="https://www.google.com/s2/favicons?domain=discord.com&sz=64" width="32" height="32" alt=""> | [Discord](./providers/@discord/api-emulator/README.md) | `@api-emulator/discord` | Community, messaging, guild, channel, bot, and interaction APIs. |
| <img src="https://www.google.com/s2/favicons?domain=elevenlabs.com&sz=64" width="32" height="32" alt=""> | [Elevenlabs](./providers/@elevenlabs/api-emulator/README.md) | `@api-emulator/elevenlabs` | Voice AI: text-to-speech, voices, models, generated audio history, and user subscription metadata. |
| <img src="https://www.google.com/s2/favicons?domain=exa.com&sz=64" width="32" height="32" alt=""> | [EXA](./providers/@exa/api-emulator/README.md) | `@api-emulator/exa` | Neural search, contents, similar-link discovery, and answer: AI agent retrieval workflows. |
| <img src="https://www.google.com/s2/favicons?domain=fal.ai&sz=64" width="32" height="32" alt=""> | [FAL](./providers/@fal/api-emulator/README.md) | `@api-emulator/fal` | Local API. |
| <img src="https://www.google.com/s2/favicons?domain=fastly.com&sz=64" width="32" height="32" alt=""> | [Fastly](./providers/@fastly/api-emulator/README.md) | `@api-emulator/fastly` | Edge cloud: services, versions, domains, backends, compute, and purge workflows. |
| <img src="https://www.google.com/s2/favicons?domain=fireworks.com&sz=64" width="32" height="32" alt=""> | [Fireworks](./providers/@fireworks/api-emulator/README.md) | `@api-emulator/fireworks` | OpenAI-compatible inference: model listing, chat completions, completions, and embeddings. |
| <img src="https://www.google.com/s2/favicons?domain=fred.stlouisfed.org&sz=64" width="32" height="32" alt=""> | [Fred](./providers/@fred/api-emulator/README.md) | `@api-emulator/fred` | Local API. |
| <img src="https://www.google.com/s2/favicons?domain=gemini.com&sz=64" width="32" height="32" alt=""> | [Gemini](./providers/@gemini/api-emulator/README.md) | `@api-emulator/gemini` | Local API. |
| <img src="https://www.google.com/s2/favicons?domain=gong.com&sz=64" width="32" height="32" alt=""> | [Gong](./providers/@gong/api-emulator/README.md) | `@api-emulator/gong` | Conversation intelligence: users, recorded calls, transcripts, and CRM activity exports. |
| <img src="https://www.google.com/s2/favicons?domain=google.com&sz=64" width="32" height="32" alt=""> | [Google](./providers/@google/api-emulator/README.md) | `@api-emulator/google` | OAuth and Workspace: Gmail, Drive, Calendar, Docs, Sheets, and admin workflows. |
| <img src="https://www.google.com/s2/favicons?domain=analytics.google.com&sz=64" width="32" height="32" alt=""> | [Google Analytics](./providers/@google-analytics/api-emulator/README.md) | `@api-emulator/google-analytics` | GA4 property metadata, report execution, realtime metrics, and audience export workflows. |
| <img src="https://www.google.com/s2/favicons?domain=google.com&sz=64" width="32" height="32" alt=""> | [Google Flights](./providers/@google-flights/api-emulator/README.md) | `@api-emulator/google-flights` | Deterministic airport search, flight offer search, and price insight responses for travel workflows. |
| <img src="https://www.google.com/s2/favicons?domain=granola.com&sz=64" width="32" height="32" alt=""> | [Granola](./providers/@granola/api-emulator/README.md) | `@api-emulator/granola` | Programmatic access to meeting notes, transcripts, participants, and summaries. |
| <img src="https://www.google.com/s2/favicons?domain=hetzner.com&sz=64" width="32" height="32" alt=""> | [Hetzner](./providers/@hetzner/api-emulator/README.md) | `@api-emulator/hetzner` | European cloud: locations, datacenters, servers, networks, volumes, and firewalls. |
| <img src="https://www.google.com/s2/favicons?domain=hostinger.com&sz=64" width="32" height="32" alt=""> | [Hostinger](./providers/@hostinger/api-emulator/README.md) | `@api-emulator/hostinger` | VPS, DNS, domain, account, and hosting infrastructure APIs. |
| <img src="https://www.google.com/s2/favicons?domain=ionos.com&sz=64" width="32" height="32" alt=""> | [Ionos](./providers/@ionos/api-emulator/README.md) | `@api-emulator/ionos` | European cloud: datacenters, servers, LANs, IP blocks, and edge services. |
| <img src="https://www.google.com/s2/favicons?domain=kalshi.com&sz=64" width="32" height="32" alt=""> | [Kalshi](./providers/@kalshi/api-emulator/README.md) | `@api-emulator/kalshi` | Local API. |
| <img src="https://www.google.com/s2/favicons?domain=kubernetes.com&sz=64" width="32" height="32" alt=""> | [Kubernetes](./providers/@kubernetes/api-emulator/README.md) | `@api-emulator/kubernetes` | Local API. |
| <img src="https://www.google.com/s2/favicons?domain=leaseweb.com&sz=64" width="32" height="32" alt=""> | [Leaseweb](./providers/@leaseweb/api-emulator/README.md) | `@api-emulator/leaseweb` | Public cloud, dedicated server, network, load balancer, and CDN APIs. |
| <img src="https://www.google.com/s2/favicons?domain=linear.app&sz=64" width="32" height="32" alt=""> | [Linear](./providers/@linear/api-emulator/README.md) | `@api-emulator/linear` | Issue tracking, teams, projects, cycles, workflow states, and product planning APIs. |
| <img src="https://www.google.com/s2/favicons?domain=linode.com&sz=64" width="32" height="32" alt=""> | [Linode](./providers/@linode/api-emulator/README.md) | `@api-emulator/linode` | Cloud: instances, regions, VPCs, images, volumes, and node balancers. |
| <img src="https://www.google.com/s2/favicons?domain=microsoft.com&sz=64" width="32" height="32" alt=""> | [Microsoft](./providers/@microsoft/api-emulator/README.md) | `@api-emulator/microsoft` | Stateful identity and Teams APIs with an OpenAPI-compatible fallback for Microsoft Graph v1.0. |
| <img src="https://www.google.com/s2/favicons?domain=mixpanel.com&sz=64" width="32" height="32" alt=""> | [Mixpanel](./providers/@mixpanel/api-emulator/README.md) | `@api-emulator/mixpanel` | Product analytics: event ingestion, user profiles, exports, and reporting. |
| <img src="https://www.google.com/s2/favicons?domain=mongodb.com&sz=64" width="32" height="32" alt=""> | [MongoDB Atlas](./providers/@mongoatlas/api-emulator/README.md) | `@api-emulator/mongoatlas` | Managed database projects, clusters, admin APIs, and data access surfaces. |
| <img src="https://www.google.com/s2/favicons?domain=neon.com&sz=64" width="32" height="32" alt=""> | [Neon](./providers/@neon/api-emulator/README.md) | `@api-emulator/neon` | Serverless Postgres with projects, branches, databases, roles, endpoints, and previews. |
| <img src="https://www.google.com/s2/favicons?domain=netlify.com&sz=64" width="32" height="32" alt=""> | [Netlify](./providers/@netlify/api-emulator/README.md) | `@api-emulator/netlify` | Web hosting: sites, deploys, builds, environment variables, and domains. |
| <img src="https://www.google.com/s2/favicons?domain=notion.so&sz=64" width="32" height="32" alt=""> | [Notion](./providers/@notion/api-emulator/README.md) | `@api-emulator/notion` | Local API. |
| <img src="https://www.google.com/s2/favicons?domain=okta.com&sz=64" width="32" height="32" alt=""> | [Okta](./providers/@okta/api-emulator/README.md) | `@api-emulator/okta` | Identity: OAuth, users, groups, apps, sessions, and identity providers. |
| <img src="https://www.google.com/s2/favicons?domain=openai.com&sz=64" width="32" height="32" alt=""> | [OpenAI](./providers/@openai/api-emulator/README.md) | `@api-emulator/openai` | Local API. |
| <img src="https://www.google.com/s2/favicons?domain=openrouter.ai&sz=64" width="32" height="32" alt=""> | [Openrouter](./providers/@openrouter/api-emulator/README.md) | `@api-emulator/openrouter` | Local API. |
| <img src="https://www.google.com/s2/favicons?domain=ovhcloud.com&sz=64" width="32" height="32" alt=""> | [Ovhcloud](./providers/@ovhcloud/api-emulator/README.md) | `@api-emulator/ovhcloud` | European public cloud: projects, regions, instances, networks, and vRack-style resources. |
| <img src="https://www.google.com/s2/favicons?domain=perplexity.ai&sz=64" width="32" height="32" alt=""> | [Perplexity](./providers/@perplexity/api-emulator/README.md) | `@api-emulator/perplexity` | Local API. |
| <img src="https://www.google.com/s2/favicons?domain=planetscale.com&sz=64" width="32" height="32" alt=""> | [Planetscale](./providers/@planetscale/api-emulator/README.md) | `@api-emulator/planetscale` | MySQL database branching, organizations, deploy requests, passwords, and workflows. |
| <img src="https://www.google.com/s2/favicons?domain=polymarket.com&sz=64" width="32" height="32" alt=""> | [Polymarket](./providers/@polymarket/api-emulator/README.md) | `@api-emulator/polymarket` | Local API. |
| <img src="https://www.google.com/s2/favicons?domain=posthog.com&sz=64" width="32" height="32" alt=""> | [PostHog](./providers/@posthog/api-emulator/README.md) | `@api-emulator/posthog` | Product analytics, event capture, feature flags, persons, and project APIs. |
| <img src="https://www.google.com/s2/favicons?domain=privy.com&sz=64" width="32" height="32" alt=""> | [Privy](./providers/@privy/api-emulator/README.md) | `@api-emulator/privy` | Embedded wallets, authentication, user identity, and authorization for crypto apps. |
| <img src="https://www.google.com/s2/favicons?domain=rackspace.com&sz=64" width="32" height="32" alt=""> | [Rackspace](./providers/@rackspace/api-emulator/README.md) | `@api-emulator/rackspace` | Cloud identity, servers, networks, object storage, and CDN/OpenStack-compatible APIs. |
| <img src="https://www.google.com/s2/favicons?domain=resend.com&sz=64" width="32" height="32" alt=""> | [Resend](./providers/@resend/api-emulator/README.md) | `@api-emulator/resend` | Developer email: sending messages, domains, contacts, audiences, and broadcasts. |
| <img src="https://www.google.com/s2/favicons?domain=retool.com&sz=64" width="32" height="32" alt=""> | [Retool](./providers/@retool/api-emulator/README.md) | `@api-emulator/retool` | Organization: users, groups, folders, apps, resources, source control, and permissions. |
| <img src="https://www.google.com/s2/favicons?domain=scaleway.com&sz=64" width="32" height="32" alt=""> | [Scaleway](./providers/@scaleway/api-emulator/README.md) | `@api-emulator/scaleway` | European cloud: regions, zones, instances, private networks, volumes, and edge services. |
| <img src="https://www.google.com/s2/favicons?domain=sec.gov&sz=64" width="32" height="32" alt=""> | [SEC](./providers/@sec/api-emulator/README.md) | `@api-emulator/sec` | Local API. |
| <img src="https://www.google.com/s2/favicons?domain=sentry.com&sz=64" width="32" height="32" alt=""> | [Sentry](./providers/@sentry/api-emulator/README.md) | `@api-emulator/sentry` | Error tracking, projects, issues, events, releases, organizations, and alerting APIs. |
| <img src="https://www.google.com/s2/favicons?domain=slack.com&sz=64" width="32" height="32" alt=""> | [Slack](./providers/@slack/api-emulator/README.md) | `@api-emulator/slack` | Workplace messaging: OAuth, users, teams, conversations, messages, and webhooks. |
| <img src="https://www.google.com/s2/favicons?domain=stripe.com&sz=64" width="32" height="32" alt=""> | [Stripe](./providers/@stripe/api-emulator/README.md) | `@api-emulator/stripe` | Payments and billing: customers, checkout, payment intents, invoices, and subscriptions. |
| <img src="https://www.google.com/s2/favicons?domain=supabase.com&sz=64" width="32" height="32" alt=""> | [Supabase](./providers/@supabase/api-emulator/README.md) | `@api-emulator/supabase` | Backend: Postgres projects, auth, storage, edge functions, and database workflows. |
| <img src="https://www.google.com/s2/favicons?domain=telegram.org&sz=64" width="32" height="32" alt=""> | [Telegram](./providers/@telegram/api-emulator/README.md) | `@api-emulator/telegram` | Bot: updates, messages, chats, webhooks, and interactive bot workflows. |
| <img src="https://www.google.com/s2/favicons?domain=tiktok.com&sz=64" width="32" height="32" alt=""> | [Tiktok](./providers/@tiktok/api-emulator/README.md) | `@api-emulator/tiktok` | Business API surfaces for advertisers, campaigns, ad groups, ads, creatives, audiences, pixels, and reports. |
| <img src="https://www.google.com/s2/favicons?domain=together.ai&sz=64" width="32" height="32" alt=""> | [Togetherai](./providers/@togetherai/api-emulator/README.md) | `@api-emulator/togetherai` | OpenAI-compatible inference, embedding, model listing, and reranking APIs. |
| <img src="https://www.google.com/s2/favicons?domain=twilio.com&sz=64" width="32" height="32" alt=""> | [Twilio](./providers/@twilio/api-emulator/README.md) | `@api-emulator/twilio` | Communications: messaging, phone numbers, verification, voice, and customer engagement. |
| <img src="https://www.google.com/s2/favicons?domain=unifygtm.com&sz=64" width="32" height="32" alt=""> | [Unifygtm](./providers/@unifygtm/api-emulator/README.md) | `@api-emulator/unifygtm` | Data: GTM objects, attributes, records, enrichment, and workflow automation. |
| <img src="https://www.google.com/s2/favicons?domain=upcloud.com&sz=64" width="32" height="32" alt=""> | [Upcloud](./providers/@upcloud/api-emulator/README.md) | `@api-emulator/upcloud` | European cloud: zones, servers, networks, storage, and account workflows. |
| <img src="https://www.google.com/s2/favicons?domain=upstash.com&sz=64" width="32" height="32" alt=""> | [Upstash](./providers/@upstash/api-emulator/README.md) | `@api-emulator/upstash` | Serverless data and messaging: Redis, QStash, Kafka-style streams, and workflows. |
| <img src="https://www.google.com/s2/favicons?domain=vercel.com&sz=64" width="32" height="32" alt=""> | [Vercel](./providers/@vercel/api-emulator/README.md) | `@api-emulator/vercel` | Deployment platform: projects, builds, domains, environment variables, teams, and accounts. |
| <img src="https://www.google.com/s2/favicons?domain=vultr.com&sz=64" width="32" height="32" alt=""> | [Vultr](./providers/@vultr/api-emulator/README.md) | `@api-emulator/vultr` | Cloud: account, regions, instances, VPCs, images, DNS, and load balancers. |
| <img src="https://www.google.com/s2/favicons?domain=workato.com&sz=64" width="32" height="32" alt=""> | [Workato](./providers/@workato/api-emulator/README.md) | `@api-emulator/workato` | Automation: recipes, connections, folders, jobs, and manifest export workflows. |
| <img src="https://www.google.com/s2/favicons?domain=zapier.com&sz=64" width="32" height="32" alt=""> | [Zapier](./providers/@zapier/api-emulator/README.md) | `@api-emulator/zapier` | Automation: apps, Zaps, task history, and webhook trigger workflows. |
|  | **Need a private service?** |  | [Build an internal provider](./docs/INTERNAL_PROVIDER_PROMPT.md) |
|  | **Need another service?** |  | [Request a provider](https://github.com/jsj/api-emulator-registry/issues/new?template=provider.yml) |
<!-- provider-wall:end -->

<hr>

<h1 align="center">API sandboxes for coding agents</h1>

<p align="center">Create the stateful API sandbox that your agent needs.<br>Run the same workflow 1,000 times without test accounts, rate limits, or stale data.</p>

<details open>
<summary align="center"><img src="https://cdn.jsdelivr.net/gh/jsj/agent-icons@5d407d8b74fe0361051aa8df6ccbc937470fd950/claude.svg" width="18" height="18" alt="Claude">&nbsp;<img src="https://cdn.jsdelivr.net/gh/jsj/agent-icons@5d407d8b74fe0361051aa8df6ccbc937470fd950/cursor.svg" width="18" height="18" alt="Cursor">&nbsp;<img src="https://cdn.jsdelivr.net/gh/jsj/agent-icons@5d407d8b74fe0361051aa8df6ccbc937470fd950/github-copilot.svg" width="18" height="18" alt="GitHub Copilot">&nbsp;<img src="https://cdn.jsdelivr.net/gh/jsj/agent-icons@5d407d8b74fe0361051aa8df6ccbc937470fd950/openai.svg" width="18" height="18" alt="OpenAI">&nbsp;&nbsp;<strong>Copy this prompt to your coding agent</strong></summary>

```text
Set up api-emulator for this repository.
First, read https://api-emulator.jsj.sh/agent.txt.
Inspect the repository and identify the APIs that its tests use.
For a private internal API, keep its provider in a private repository and use synthetic test data with no PII.
Before you edit files, describe the smallest setup plan.
Keep the existing provider SDKs.
Change only their base URLs and test credentials.
Start only the providers that the repository needs.
Add or update one representative integration test.
Run that test against the local emulator.
Do not use production credentials or change production configuration.
Reset emulator state after the test.
If the required provider behavior is unavailable, stop and report the missing behavior.
Report the changed files, local URLs, test command, test result, and remaining gaps.
```

</details>

## License

MIT
