# Meta, Sentry, and Google Play CLI Emulator Strategy

Extend `npm run smoke:cli` with provider CLIs that exercise real user workflows against local emulators.

## Targets

| Surface | CLI | Emulator target | Status |
|---|---|---|---|
| Meta Ads | `meta-ads` from `pip install meta-ads` | `@meta` Marketing API / Graph API-compatible routes | Graph route smoke covered; CLI base URL probe remains |
| Facebook Messenger | No official CLI found; official Graph SDK hardcodes `https://graph.facebook.com` but supports per-call URL override | New `@facebook-messenger` Messenger Platform Graph API routes | Route smoke covers pages, Send API, conversations, profiles, and webhook verification |
| WhatsApp Cloud API | No official CLI found; official WhatsApp Node.js SDK exposes `BaseURL` config defaulting to `graph.facebook.com` | New `@whatsapp` WhatsApp Cloud API Graph routes | Route smoke covers phone numbers, messages, media, templates, and webhook verification |
| Meta Horizon / Oculus | `/usr/local/bin/ovr-platform-util` | New Meta Horizon app release/build emulator routes | CLI installed; base URL override unknown |
| Sentry | `sentry-cli` from `getsentry/sentry-cli` | Expand `@sentry` beyond webhook producer into Sentry REST subset | Needs install; likely supports `SENTRY_URL` |
| Google Play Console | `/Users/james/Developer/zzabandoned/play-console-cli` (`gplay`) | New Google Play Android Publisher emulator routes | Needs local binary/build + base URL patch/probe |
| fal / genmedia | `genmedia` | Existing `@fal` model, queue, assets, and platform routes | CLI smoke covers `models`, `schema`, async `run`, and completed `run` via temp patched binary |
| Salesforce | `/opt/homebrew/bin/sf` | New Salesforce REST emulator routes | CLI smoke covers access-token auth, SOQL query, record create/read, and REST limits |
| Adyen | `adyen-cli` from `Toshik1978/adyen-cli` | `@adyen` Management API-compatible store and payment method routes | OSS CLI supports host env vars; smoke patches scheme to local HTTP and runs `methods` against emulator |
| Alpaca | `alpaca` from `alpacahq/cli` | Existing `@alpaca` trading and market data routes | OSS CLI smoke patches trading/data base URLs and covers account, position, order, and bars workflows |
| LinkedIn | `linkedin-cli` from `tigillo/linkedin-cli` | New `@linkedin` API v2/REST-compatible routes | CLI smoke patches direct API/OAuth URLs and covers `me` plus UGC post creation |
| YouTube Data API | `youtube-data-cli` from `Bin-Huang/youtube-data-cli` | Future `@youtube` Data API-compatible routes | OSS TypeScript CLI has one-file Data/Upload API base constants; good candidate for temp patching against emulator |
| YouTube Analytics API | `youtube-analytics-cli` from `Bin-Huang/youtube-analytics-cli` | Future `@youtube` Analytics API-compatible routes | Companion OSS TypeScript CLI covers channels, videos, reports, groups, and group items with one-file Data/Analytics base constants |

## Meta Ads

Current `@meta` uses the ad-platform factory and should be the anchor. The CLI smoke should first verify whether `meta-ads` exposes an API host/base URL option or env var. If it does, wire a minimal flow:

1. List ad accounts.
2. Create a paused campaign.
3. Read it back.

If the CLI hardcodes Graph API hosts, patch/wrap the CLI like the Supabase plan and add a single explicit base URL env var.

## Facebook Messenger

No official Messenger Platform CLI was found. The official Meta Graph SDK source points at `https://graph.facebook.com` and supports a per-call `urlOverride`, so the emulator targets Graph-compatible routes rather than a CLI-specific contract.

First emulator slice:

- `/webhook` verification challenge
- `/:version/me/accounts`
- `/:version/:pageId/conversations`
- `/:version/:conversationId/messages`
- `/:version/:pageId/messages`
- `/:version/me/messages`
- `/:version/:profileId`

First smoke:

1. Verify webhook challenge handling.
2. List managed pages.
3. Send a text message through the Send API.
4. List conversations and read messages.
5. Read a seeded PSID profile.

## WhatsApp Cloud API

No official WhatsApp CLI was found. The official WhatsApp Node.js SDK is the best compatibility oracle and exposes a configurable `BaseURL` whose default is `graph.facebook.com`.

First emulator slice:

- `/webhook` verification challenge
- `/:version/:businessAccountId/phone_numbers`
- `/:version/:businessAccountId/message_templates`
- `/:version/:phoneNumberId/messages`
- `/:version/:phoneNumberId/media`
- `/:version/:mediaId`

First smoke:

1. Verify webhook challenge handling.
2. List business phone numbers.
3. Send a WhatsApp text message.
4. List stored messages.
5. Upload/read/delete media metadata.

## Oculus / Meta Horizon

`ovr-platform-util` is installed and exposes build/release-channel commands. This is less likely to expose a documented base URL override because it is a closed binary.

Current coverage:

- Dedicated `@oculus` emulator covers GraphQL, release channels, build metadata, access tokens, redists, inspect, and reset.
- Manual OVR E2E DNS/TLS interception notes live in `docs/specs/OCULUS_OVR_E2E_INTERCEPTION.md`.

Future strategy:

1. Probe flags/env/config for endpoint override.
2. If unavailable, treat this as a contract oracle only: inspect command payload expectations, then implement emulator routes for app builds, release channels, build upload metadata, and access-token flows.
3. If an endpoint override exists, add a smoke that calls `get-release-channel-data` and a non-destructive build/release-channel read path.

## Sentry

Current `@sentry` only emits webhook payloads. `sentry-cli` is a better compatibility test if the emulator adds REST routes for common CLI operations.

First CLI smoke:

1. Configure `SENTRY_URL=<emulator>`.
2. `sentry-cli projects list` or `sentry-cli releases list`.
3. Add source-map/upload dry-run style coverage if the CLI supports it without external state.

Emulator route candidates:

- `/api/0/organizations/`
- `/api/0/organizations/:org/projects/`
- `/api/0/organizations/:org/releases/`
- release file artifact upload/list endpoints

## Google Play Console

`gplay` wraps Android Publisher. This should become a dedicated Play Publisher emulator, not part of Google Workspace.

First emulator slice:

- Tracks list/update
- Edits insert/commit
- Reviews list/reply
- In-app products/subscriptions list
- Vitals issue list

First CLI smoke:

1. Build or locate the local `gplay` binary.
2. Patch/probe for an Android Publisher API base URL override.
3. Use temp credentials/profile and run a read-only JSON command such as tracks list or reviews list against the emulator.

## fal / genmedia

`genmedia` is installed and configured non-interactively with JSON output and `.env` auto-loading enabled. The setup intentionally did not save a key; CLI tests should inject a dummy `FAL_KEY` and emulator base URL through environment variables or a patched genmedia base-url flag.

Current smoke coverage:

1. Start the `@fal` emulator.
2. Create a temporary copy of `genmedia` with the embedded platform base replaced by `http://127.0.0.1:8787` and the bundled fal-js SDK configured to proxy runtime requests to the emulator.
3. Run `genmedia models --endpoint_id fal-ai/flux/dev`.
4. Run `genmedia schema fal-ai/flux/dev`.
5. Run `genmedia run --async fal-ai/flux/dev`.
6. Run `genmedia run fal-ai/flux/dev` and assert the deterministic image result.

Remaining gap: replace the temporary binary patch with an upstream base URL/env override in genmedia/fal-js.

## Salesforce

`sf org login access-token` can target a local emulator with `--instance-url` and `SF_ACCESS_TOKEN=<org id>!<token>`. The login flow showed the CLI calls `/services/oauth2/userinfo`, reads the current User sObject, and runs setup SOQL probes for `ScratchOrgInfo` and `Organization`.

First emulator slice:

- `/services/oauth2/userinfo`
- `/services/data`
- `/services/data/:version`
- `/services/data/:version/limits`
- `/services/data/:version/query`
- `/services/data/:version/sobjects`
- `/services/data/:version/sobjects/:sobject/describe`
- `/services/data/:version/sobjects/:sobject`
- `/services/data/:version/sobjects/:sobject/:id`

First CLI smoke:

1. Authenticate with `/opt/homebrew/bin/sf org login access-token --instance-url <emulator>`.
2. Run `sf data query` against seeded Accounts.
3. Create an Account with `sf data create record`.
4. Read it back with `sf data get record`.
5. Probe REST compatibility with `sf api request rest /services/data/v64.0/limits`.

## Adyen

No official Adyen CLI was found, but `Toshik1978/adyen-cli` is OSS and exposes host env vars for CAL, Management, KYC, and Balance Platform endpoints. The CLI hardcodes `https://%s/...`, so the smoke builds a temporary copy with that scheme patched to `http://%s/...`, sets all `ADYEN_*_URL` env vars to the local emulator host, and runs the `methods` CSV workflow.

First emulator slice:

- `/v3/stores?reference=:storeReference`
- `/v3/merchants/:merchantId/paymentMethodSettings`

First CLI smoke:

1. Build or clone `Toshik1978/adyen-cli`.
2. Patch the temporary source copy to call local HTTP.
3. Run `adyen-cli methods --csv <temp csv>` with dummy keys and local `ADYEN_*_URL` env vars.
4. Inspect emulator state to assert payment method settings were created.

## Alpaca

`alpacahq/cli` is OSS and exercises the same Trading API and Market Data surfaces implemented by `@alpaca`. The CLI currently resolves paper, live, and data URLs from internal constants, so the smoke builds a temporary copy with those constants patched to the local emulator.

Current CLI smoke:

1. Build or clone `alpacahq/cli`.
2. Patch paper, live, and data base URLs to the local emulator.
3. Run `alpaca account get`.
4. Run all safe non-interactive API command families: account, raw API, clock, calendar, asset, corporate action, position, order, watchlist, wallet, crypto-perp, stock data, crypto data, forex, fixed income, options, screeners, and news.
5. Submit, fetch, replace, cancel, and cancel-all safe paper-style `SPY` orders, and exercise/close emulator-only positions.
6. Assert trading, wallet, stock, crypto, crypto-perp, option, screener, forex, fixed income, logo, corporate-action, and news payloads unmarshal through the generated CLI clients.

Flaws revealed and fixed:

- API-shaped `id`, `created_at`, and `submitted_at` fields are required for generated account/order clients.
- Replaced and close-position order responses must use the public order payload shape, not internal store rows.
- Single-symbol stock latest/history routes are required in addition to multi-symbol routes.
- `watchlists:by_name` routes are part of the CLI surface.
- Asset fixed-income, account activity, v3 market clock/calendar, wallet, crypto-perp, forex, logo, stock auction/meta, option condition, and corporate-action data routes are part of the generated CLI surface.
- Stock trades need numeric trade IDs; crypto and option quote/trade payloads have distinct schemas from stock quote/trade payloads.
- Stock auction and market-data corporate action envelopes differ from simple route-smoke payloads.
- Screener responses need `last_updated`, `market_type`, and mover `price` fields.

## LinkedIn

Use GitHub code search through `gh api` as the first discovery pass for LinkedIn-compatible CLIs and SDK wrappers. Searching for the canonical base URLs has been more effective than package-name searches because it finds clients that hardcode or centralize endpoint constants.

Useful probes:

1. `gh api search/code -f q='"api.linkedin.com/v2" language:Go'`
2. `gh api search/code -f q='"api.linkedin.com/rest" language:JavaScript'`
3. `gh api search/code -f q='"www.linkedin.com/oauth" "baseURL"'`

Current CLI smoke:

1. Clone or use `tigillo/linkedin-cli`.
2. Patch the temporary source copy's direct API/OAuth URL literals to the local emulator.
3. Seed a temp `~/.linkedin/config.json` with a dummy access token and member URN.
4. Run `linkedin me` against `/v2/me`.
5. Run `linkedin post "LinkedIn CLI Smoke"` against `/v2/ugcPosts` and assert the emulator stored the created UGC post.

First emulator slice:

- `/oauth/v2/accessToken`
- `/v2/me`
- `/v2/ugcPosts`
- `/v2/organizations`
- `/v2/adAccountsV2`
- `/v2/adCampaignsV2`
- `/rest/adAccounts`
- `/rest/adCampaigns`

## YouTube Data API

Use GitHub code search through `gh api` as the first discovery pass for YouTube-compatible CLIs and SDK wrappers. Searching for canonical API base URLs is likely more useful than package-name searches because many clients brand themselves as uploaders, channel tools, playlist managers, analytics utilities, or creator dashboards rather than YouTube Data API CLIs.

Candidates found:

- `Bin-Huang/youtube-data-cli` is the best posting/upload smoke target: it is an active Apache-2.0 TypeScript CLI with JSON stdout, broad YouTube Data API v3 resource coverage, native `fetch`, and only `commander` as a runtime dependency.
- `Bin-Huang/youtube-analytics-cli` is the companion reporting smoke target: it is an active Apache-2.0 TypeScript CLI for YouTube Data API v3 plus YouTube Analytics API v2 reports, groups, and group items.
- `youtube-data-cli` patch targets are centralized in `src/api.ts`:
  - `DATA_API_BASE = "https://www.googleapis.com/youtube/v3"`
  - `UPLOAD_API_BASE = "https://www.googleapis.com/upload/youtube/v3"`
- `youtube-analytics-cli` patch targets are centralized in `src/api.ts`:
  - `DATA_API_BASE = "https://www.googleapis.com/youtube/v3"`
  - `ANALYTICS_API_BASE = "https://youtubeanalytics.googleapis.com/v2"`
- Lower-priority candidates: `nerveband/yt-api-cli` is active but uses generated Google API clients, `djthorpe/ytapi` is archived, and `Byron/google-apis-rs/gen/youtube3-cli` is comprehensive but generated and heavier to build/patch.

Useful probes:

1. `gh api search/code -f q='"youtube.googleapis.com/youtube/v3" cli'`
2. `gh api search/code -f q='"www.googleapis.com/youtube/v3" cli'`
3. `gh api search/code -f q='"youtube/v3" "baseURL"'`
4. `gh api search/code -f q='"upload/youtube/v3" "baseURL"'`

First strategy:

1. Build or clone `Bin-Huang/youtube-data-cli`.
2. Build or clone `Bin-Huang/youtube-analytics-cli`.
3. Patch each temporary source copy's `src/api.ts` base constants to the local emulator's Data, Upload, and Analytics API routes.
4. Use temp credentials or env vars with a dummy `YOUTUBE_API_KEY`, `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, and `YOUTUBE_REFRESH_TOKEN`.
5. Run read-only JSON commands first: `search`, `channels`, `videos`, `playlists`, `playlist-items`, `comment-threads`, `comments`, `i18n-languages`, `i18n-regions`, `video-categories`, and `video-abuse-report-reasons`.
6. Run analytics JSON commands next: `channels`, `videos`, `report`, `groups`, and `group-items`.
7. Add write coverage only for emulator-safe private resources, such as private playlist create/update/delete, playlist-item create/delete, comment insert/update/delete, video metadata update, and upload-session flows.
8. Promote both CLIs into a dedicated YouTube CLI smoke once the emulator has seeded channel, playlist, video, comment, upload-session, analytics-report, group, and group-item responses.

## Common harness changes

- Keep CLI config in temp dirs.
- Prefer read/list commands first, then one create/update command only when the CLI can make safe paused/draft resources.
- Make missing base URL support explicit with a tracked skip and follow-up patch target.
- Add each CLI probe behind command availability checks so local development remains ergonomic.
