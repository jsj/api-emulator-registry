![api-emulator cover](./.github/assets/cover.png)

# api-emulator-registry

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

Open an [issue](https://github.com/jsj/api-emulator/issues) for an error, missing endpoint, or provider request.

## Provider wall

<!-- provider-wall:start -->
<table>
  <tr>
    <td align="center"><a href="./providers/@adp/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=adp.com&sz=64" width="36" height="36" alt=""><br>ADP</a></td>
    <td align="center"><a href="./providers/@adyen/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=adyen.com&sz=64" width="36" height="36" alt=""><br>Adyen</a></td>
    <td align="center"><a href="./providers/@agentcard/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=agentcard.com&sz=64" width="36" height="36" alt=""><br>Agentcard</a></td>
    <td align="center"><a href="./providers/@agentmail/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=agentmail.com&sz=64" width="36" height="36" alt=""><br>Agentmail</a></td>
    <td align="center"><a href="./providers/@akamai/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=akamai.com&sz=64" width="36" height="36" alt=""><br>Akamai</a></td>
    <td align="center"><a href="./providers/@alibaba-cloud/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=alibabacloud.com&sz=64" width="36" height="36" alt=""><br>Alibaba Cloud</a></td>
    <td align="center"><a href="./providers/@alpaca/api-emulator/package.json"><img src="https://www.google.com/s2/favicons?domain=alpaca.com&sz=64" width="36" height="36" alt=""><br>Alpaca</a></td>
    <td align="center"><a href="./providers/@alpha-vantage/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=alphavantage.com&sz=64" width="36" height="36" alt=""><br>Alpha Vantage</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@amazon-seller/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=sell.amazon.com&sz=64" width="36" height="36" alt=""><br>Amazon Seller</a></td>
    <td align="center"><a href="./providers/@anotes/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=anotes.com&sz=64" width="36" height="36" alt=""><br>Anotes</a></td>
    <td align="center"><a href="./providers/@anthropic/api-emulator.mjs"><img src="https://www.google.com/s2/favicons?domain=anthropic.com&sz=64" width="36" height="36" alt=""><br>Anthropic</a></td>
    <td align="center"><a href="./providers/@app-store-connect/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=appstoreconnect.apple.com&sz=64" width="36" height="36" alt=""><br>App Store Connect</a></td>
    <td align="center"><a href="./providers/@apple/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=apple.com&sz=64" width="36" height="36" alt=""><br>Apple</a></td>
    <td align="center"><a href="./providers/@apple-maps/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=maps.apple.com&sz=64" width="36" height="36" alt=""><br>Apple Maps</a></td>
    <td align="center"><a href="./providers/@apple-media/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=apple.com&sz=64" width="36" height="36" alt=""><br>Apple Media</a></td>
    <td align="center"><a href="./providers/@apple-music/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=music.apple.com&sz=64" width="36" height="36" alt=""><br>Apple Music</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@apple-podcasts/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=podcasts.apple.com&sz=64" width="36" height="36" alt=""><br>Apple Podcasts</a></td>
    <td align="center"><a href="./providers/@applecare/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=applecare.com&sz=64" width="36" height="36" alt=""><br>AppleCare</a></td>
    <td align="center"><a href="./providers/@applovin/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=applovin.com&sz=64" width="36" height="36" alt=""><br>Applovin</a></td>
    <td align="center"><a href="./providers/@argo/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=argo.com&sz=64" width="36" height="36" alt=""><br>Argo</a></td>
    <td align="center"><a href="./providers/@arxiv/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=arxiv.org&sz=64" width="36" height="36" alt=""><br>arXiv</a></td>
    <td align="center"><a href="./providers/@attio/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=attio.com&sz=64" width="36" height="36" alt=""><br>Attio</a></td>
    <td align="center"><a href="./providers/@audible/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=audible.com&sz=64" width="36" height="36" alt=""><br>Audible</a></td>
    <td align="center"><a href="./providers/@auth0/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=auth0.com&sz=64" width="36" height="36" alt=""><br>Auth0</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@aws/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=64" width="36" height="36" alt=""><br>AWS</a></td>
    <td align="center"><a href="./providers/@azure/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=azure.microsoft.com&sz=64" width="36" height="36" alt=""><br>Azure</a></td>
    <td align="center"><a href="./providers/@backblaze/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=backblaze.com&sz=64" width="36" height="36" alt=""><br>Backblaze</a></td>
    <td align="center"><a href="./providers/@baseten/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=baseten.com&sz=64" width="36" height="36" alt=""><br>Baseten</a></td>
    <td align="center"><a href="./providers/@bilt/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=bilt.com&sz=64" width="36" height="36" alt=""><br>Bilt</a></td>
    <td align="center"><a href="./providers/@bland/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=bland.com&sz=64" width="36" height="36" alt=""><br>Bland</a></td>
    <td align="center"><a href="./providers/@brave-search/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=brave.com&sz=64" width="36" height="36" alt=""><br>Brave Search</a></td>
    <td align="center"><a href="./providers/@brex/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=brex.com&sz=64" width="36" height="36" alt=""><br>Brex</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@browserbase/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=browserbase.com&sz=64" width="36" height="36" alt=""><br>Browserbase</a></td>
    <td align="center"><a href="./providers/@bunny/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=bunny.com&sz=64" width="36" height="36" alt=""><br>Bunny</a></td>
    <td align="center"><a href="./providers/@canva/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=canva.com&sz=64" width="36" height="36" alt=""><br>Canva</a></td>
    <td align="center"><a href="./providers/@canvas/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=canvas.com&sz=64" width="36" height="36" alt=""><br>Canvas</a></td>
    <td align="center"><a href="./providers/@capcut/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=capcut.com&sz=64" width="36" height="36" alt=""><br>Capcut</a></td>
    <td align="center"><a href="./providers/@clay/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=clay.com&sz=64" width="36" height="36" alt=""><br>Clay</a></td>
    <td align="center"><a href="./providers/@clerk/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=clerk.com&sz=64" width="36" height="36" alt=""><br>Clerk</a></td>
    <td align="center"><a href="./providers/@cloudflare/api-emulator/package.json"><img src="https://www.google.com/s2/favicons?domain=cloudflare.com&sz=64" width="36" height="36" alt=""><br>Cloudflare</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@coderabbit/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=coderabbit.com&sz=64" width="36" height="36" alt=""><br>CodeRabbit</a></td>
    <td align="center"><a href="./providers/@coinbase/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=coinbase.com&sz=64" width="36" height="36" alt=""><br>Coinbase</a></td>
    <td align="center"><a href="./providers/@concur/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=concur.com&sz=64" width="36" height="36" alt=""><br>Concur</a></td>
    <td align="center"><a href="./providers/@congress/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=congress.com&sz=64" width="36" height="36" alt=""><br>Congress</a></td>
    <td align="center"><a href="./providers/@context/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=context.com&sz=64" width="36" height="36" alt=""><br>Context</a></td>
    <td align="center"><a href="./providers/@coreweave/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=coreweave.com&sz=64" width="36" height="36" alt=""><br>CoreWeave</a></td>
    <td align="center"><a href="./providers/@courtlistener/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=courtlistener.com&sz=64" width="36" height="36" alt=""><br>Courtlistener</a></td>
    <td align="center"><a href="./providers/@craigslist/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=craigslist.org&sz=64" width="36" height="36" alt=""><br>Craigslist</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@crusoe/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=crusoe.com&sz=64" width="36" height="36" alt=""><br>Crusoe</a></td>
    <td align="center"><a href="./providers/@databricks/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=databricks.com&sz=64" width="36" height="36" alt=""><br>Databricks</a></td>
    <td align="center"><a href="./providers/@datadog/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=datadog.com&sz=64" width="36" height="36" alt=""><br>Datadog</a></td>
    <td align="center"><a href="./providers/@decagon/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=decagon.ai&sz=64" width="36" height="36" alt=""><br>Decagon</a></td>
    <td align="center"><a href="./providers/@deel/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=deel.com&sz=64" width="36" height="36" alt=""><br>Deel</a></td>
    <td align="center"><a href="./providers/@devin/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=devin.com&sz=64" width="36" height="36" alt=""><br>Devin</a></td>
    <td align="center"><a href="./providers/@digitalocean/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=digitalocean.com&sz=64" width="36" height="36" alt=""><br>DigitalOcean</a></td>
    <td align="center"><a href="./providers/@discord/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=discord.com&sz=64" width="36" height="36" alt=""><br>Discord</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@docusign/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=docusign.com&sz=64" width="36" height="36" alt=""><br>Docusign</a></td>
    <td align="center"><a href="./providers/@doordash/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=doordash.com&sz=64" width="36" height="36" alt=""><br>DoorDash</a></td>
    <td align="center"><a href="./providers/@doppler/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=doppler.com&sz=64" width="36" height="36" alt=""><br>Doppler</a></td>
    <td align="center"><a href="./providers/@duke-energy/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=dukeenergy.com&sz=64" width="36" height="36" alt=""><br>Duke Energy</a></td>
    <td align="center"><a href="./providers/@e-trade/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=etrade.com&sz=64" width="36" height="36" alt=""><br>E Trade</a></td>
    <td align="center"><a href="./providers/@ebay-seller/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=ebay.com&sz=64" width="36" height="36" alt=""><br>Ebay Seller</a></td>
    <td align="center"><a href="./providers/@eia/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=eia.com&sz=64" width="36" height="36" alt=""><br>EIA</a></td>
    <td align="center"><a href="./providers/@eight-sleep/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=eightsleep.com&sz=64" width="36" height="36" alt=""><br>Eight Sleep</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@elevenlabs/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=elevenlabs.com&sz=64" width="36" height="36" alt=""><br>Elevenlabs</a></td>
    <td align="center"><a href="./providers/@ethos/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=ethos.com&sz=64" width="36" height="36" alt=""><br>Ethos</a></td>
    <td align="center"><a href="./providers/@exa/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=exa.com&sz=64" width="36" height="36" alt=""><br>EXA</a></td>
    <td align="center"><a href="./providers/@facebook-messenger/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=messenger.com&sz=64" width="36" height="36" alt=""><br>Facebook Messenger</a></td>
    <td align="center"><a href="./providers/@fal/api-emulator.mjs"><img src="https://www.google.com/s2/favicons?domain=fal.ai&sz=64" width="36" height="36" alt=""><br>FAL</a></td>
    <td align="center"><a href="./providers/@fastly/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=fastly.com&sz=64" width="36" height="36" alt=""><br>Fastly</a></td>
    <td align="center"><a href="./providers/@fidelity/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=fidelity.com&sz=64" width="36" height="36" alt=""><br>Fidelity</a></td>
    <td align="center"><a href="./providers/@figma/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=figma.com&sz=64" width="36" height="36" alt=""><br>Figma</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@financialdatasets/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=financialdatasets.com&sz=64" width="36" height="36" alt=""><br>Financialdatasets</a></td>
    <td align="center"><a href="./providers/@finnhub/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=finnhub.com&sz=64" width="36" height="36" alt=""><br>Finnhub</a></td>
    <td align="center"><a href="./providers/@fireworks/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=fireworks.com&sz=64" width="36" height="36" alt=""><br>Fireworks</a></td>
    <td align="center"><a href="./providers/@flightradar24/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=flightradar24.com&sz=64" width="36" height="36" alt=""><br>Flightradar24</a></td>
    <td align="center"><a href="./providers/@fred/api-emulator.mjs"><img src="https://www.google.com/s2/favicons?domain=fred.stlouisfed.org&sz=64" width="36" height="36" alt=""><br>Fred</a></td>
    <td align="center"><a href="./providers/@gcp/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=gcp.com&sz=64" width="36" height="36" alt=""><br>GCP</a></td>
    <td align="center"><a href="./providers/@geico/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=geico.com&sz=64" width="36" height="36" alt=""><br>Geico</a></td>
    <td align="center"><a href="./providers/@gemini/api-emulator.mjs"><img src="https://www.google.com/s2/favicons?domain=gemini.com&sz=64" width="36" height="36" alt=""><br>Gemini</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@github/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=github.com&sz=64" width="36" height="36" alt=""><br>GitHub</a></td>
    <td align="center"><a href="./providers/@gitlab/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=gitlab.com&sz=64" width="36" height="36" alt=""><br>Gitlab</a></td>
    <td align="center"><a href="./providers/@gong/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=gong.com&sz=64" width="36" height="36" alt=""><br>Gong</a></td>
    <td align="center"><a href="./providers/@goodreads/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=goodreads.com&sz=64" width="36" height="36" alt=""><br>Goodreads</a></td>
    <td align="center"><a href="./providers/@google/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=google.com&sz=64" width="36" height="36" alt=""><br>Google</a></td>
    <td align="center"><a href="./providers/@google-analytics/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=analytics.google.com&sz=64" width="36" height="36" alt=""><br>Google Analytics</a></td>
    <td align="center"><a href="./providers/@google-classroom/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=classroom.google.com&sz=64" width="36" height="36" alt=""><br>Google Classroom</a></td>
    <td align="center"><a href="./providers/@google-flights/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=google.com&sz=64" width="36" height="36" alt=""><br>Google Flights</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@google-forms/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=forms.google.com&sz=64" width="36" height="36" alt=""><br>Google Forms</a></td>
    <td align="center"><a href="./providers/@google-maps/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=maps.google.com&sz=64" width="36" height="36" alt=""><br>Google Maps</a></td>
    <td align="center"><a href="./providers/@google-play/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=play.google.com&sz=64" width="36" height="36" alt=""><br>Google Play</a></td>
    <td align="center"><a href="./providers/@govinfo/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=govinfo.com&sz=64" width="36" height="36" alt=""><br>Govinfo</a></td>
    <td align="center"><a href="./providers/@grafana/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=grafana.com&sz=64" width="36" height="36" alt=""><br>Grafana</a></td>
    <td align="center"><a href="./providers/@granola/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=granola.com&sz=64" width="36" height="36" alt=""><br>Granola</a></td>
    <td align="center"><a href="./providers/@greptile/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=greptile.com&sz=64" width="36" height="36" alt=""><br>Greptile</a></td>
    <td align="center"><a href="./providers/@gusto/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=gusto.com&sz=64" width="36" height="36" alt=""><br>Gusto</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@harvey/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=harvey.com&sz=64" width="36" height="36" alt=""><br>Harvey</a></td>
    <td align="center"><a href="./providers/@hashicorp-vault/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=vaultproject.io&sz=64" width="36" height="36" alt=""><br>Hashicorp Vault</a></td>
    <td align="center"><a href="./providers/@hetzner/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=hetzner.com&sz=64" width="36" height="36" alt=""><br>Hetzner</a></td>
    <td align="center"><a href="./providers/@hostinger/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=hostinger.com&sz=64" width="36" height="36" alt=""><br>Hostinger</a></td>
    <td align="center"><a href="./providers/@hubspot/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=hubspot.com&sz=64" width="36" height="36" alt=""><br>Hubspot</a></td>
    <td align="center"><a href="./providers/@huggingface/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=huggingface.co&sz=64" width="36" height="36" alt=""><br>Huggingface</a></td>
    <td align="center"><a href="./providers/@imsg/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=apple.com&sz=64" width="36" height="36" alt=""><br>iMessage</a></td>
    <td align="center"><a href="./providers/@interactive-brokers/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=interactivebrokers.com&sz=64" width="36" height="36" alt=""><br>Interactive Brokers</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@intercom/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=intercom.com&sz=64" width="36" height="36" alt=""><br>Intercom</a></td>
    <td align="center"><a href="./providers/@intuit/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=intuit.com&sz=64" width="36" height="36" alt=""><br>Intuit</a></td>
    <td align="center"><a href="./providers/@ionos/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=ionos.com&sz=64" width="36" height="36" alt=""><br>Ionos</a></td>
    <td align="center"><a href="./providers/@jira/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=atlassian.com&sz=64" width="36" height="36" alt=""><br>Jira</a></td>
    <td align="center"><a href="./providers/@joinwarp-payroll/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=joinwarp.com&sz=64" width="36" height="36" alt=""><br>Joinwarp Payroll</a></td>
    <td align="center"><a href="./providers/@kalshi/api-emulator/package.json"><img src="https://www.google.com/s2/favicons?domain=kalshi.com&sz=64" width="36" height="36" alt=""><br>Kalshi</a></td>
    <td align="center"><a href="./providers/@leaseweb/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=leaseweb.com&sz=64" width="36" height="36" alt=""><br>Leaseweb</a></td>
    <td align="center"><a href="./providers/@legalzoom/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=legalzoom.com&sz=64" width="36" height="36" alt=""><br>Legalzoom</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@legora/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=legora.com&sz=64" width="36" height="36" alt=""><br>Legora</a></td>
    <td align="center"><a href="./providers/@lemonade/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=lemonade.com&sz=64" width="36" height="36" alt=""><br>Lemonade</a></td>
    <td align="center"><a href="./providers/@lexis/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=lexisnexis.com&sz=64" width="36" height="36" alt=""><br>Lexis</a></td>
    <td align="center"><a href="./providers/@lightreel/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=lightreel.com&sz=64" width="36" height="36" alt=""><br>Lightreel</a></td>
    <td align="center"><a href="./providers/@linear/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=linear.app&sz=64" width="36" height="36" alt=""><br>Linear</a></td>
    <td align="center"><a href="./providers/@linkedin/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=linkedin.com&sz=64" width="36" height="36" alt=""><br>LinkedIn</a></td>
    <td align="center"><a href="./providers/@linode/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=linode.com&sz=64" width="36" height="36" alt=""><br>Linode</a></td>
    <td align="center"><a href="./providers/@listenlabs/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=listenlabs.com&sz=64" width="36" height="36" alt=""><br>Listenlabs</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@lucent/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=lucent.com&sz=64" width="36" height="36" alt=""><br>Lucent</a></td>
    <td align="center"><a href="./providers/@marketo/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=marketo.com&sz=64" width="36" height="36" alt=""><br>Marketo</a></td>
    <td align="center"><a href="./providers/@mediawiki/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=mediawiki.org&sz=64" width="36" height="36" alt=""><br>Mediawiki</a></td>
    <td align="center"><a href="./providers/@mercury/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=mercury.com&sz=64" width="36" height="36" alt=""><br>Mercury</a></td>
    <td align="center"><a href="./providers/@meta/api-emulator.mjs"><img src="https://www.google.com/s2/favicons?domain=meta.com&sz=64" width="36" height="36" alt=""><br>Meta</a></td>
    <td align="center"><a href="./providers/@metlife/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=metlife.com&sz=64" width="36" height="36" alt=""><br>Metlife</a></td>
    <td align="center"><a href="./providers/@microsoft/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=microsoft.com&sz=64" width="36" height="36" alt=""><br>Microsoft</a></td>
    <td align="center"><a href="./providers/@mintlify/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=mintlify.com&sz=64" width="36" height="36" alt=""><br>Mintlify</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@mixpanel/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=mixpanel.com&sz=64" width="36" height="36" alt=""><br>Mixpanel</a></td>
    <td align="center"><a href="./providers/@mobbin/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=mobbin.com&sz=64" width="36" height="36" alt=""><br>Mobbin</a></td>
    <td align="center"><a href="./providers/@modal/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=modal.com&sz=64" width="36" height="36" alt=""><br>Modal</a></td>
    <td align="center"><a href="./providers/@mongoatlas/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=mongodb.com&sz=64" width="36" height="36" alt=""><br>MongoDB Atlas</a></td>
    <td align="center"><a href="./providers/@neon/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=neon.com&sz=64" width="36" height="36" alt=""><br>Neon</a></td>
    <td align="center"><a href="./providers/@netlify/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=netlify.com&sz=64" width="36" height="36" alt=""><br>Netlify</a></td>
    <td align="center"><a href="./providers/@nytimes/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=nytimes.com&sz=64" width="36" height="36" alt=""><br>New York Times</a></td>
    <td align="center"><a href="./providers/@nextdoor/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=nextdoor.com&sz=64" width="36" height="36" alt=""><br>Nextdoor</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@notion/api-emulator/package.json"><img src="https://www.google.com/s2/favicons?domain=notion.so&sz=64" width="36" height="36" alt=""><br>Notion</a></td>
    <td align="center"><a href="./providers/@oci/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=oracle.com&sz=64" width="36" height="36" alt=""><br>OCI</a></td>
    <td align="center"><a href="./providers/@oculus/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=oculus.com&sz=64" width="36" height="36" alt=""><br>Oculus</a></td>
    <td align="center"><a href="./providers/@okta/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=okta.com&sz=64" width="36" height="36" alt=""><br>Okta</a></td>
    <td align="center"><a href="./providers/@openai/api-emulator.mjs"><img src="https://www.google.com/s2/favicons?domain=openai.com&sz=64" width="36" height="36" alt=""><br>OpenAI</a></td>
    <td align="center"><a href="./providers/@openfda/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=openfda.com&sz=64" width="36" height="36" alt=""><br>Openfda</a></td>
    <td align="center"><a href="./providers/@openrouter/api-emulator.mjs"><img src="https://www.google.com/s2/favicons?domain=openrouter.ai&sz=64" width="36" height="36" alt=""><br>Openrouter</a></td>
    <td align="center"><a href="./providers/@opentable/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=opentable.com&sz=64" width="36" height="36" alt=""><br>Opentable</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@oura/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=oura.com&sz=64" width="36" height="36" alt=""><br>Oura</a></td>
    <td align="center"><a href="./providers/@ovhcloud/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=ovhcloud.com&sz=64" width="36" height="36" alt=""><br>Ovhcloud</a></td>
    <td align="center"><a href="./providers/@patreon/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=patreon.com&sz=64" width="36" height="36" alt=""><br>Patreon</a></td>
    <td align="center"><a href="./providers/@paypal/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=paypal.com&sz=64" width="36" height="36" alt=""><br>Paypal</a></td>
    <td align="center"><a href="./providers/@perplexity/api-emulator.mjs"><img src="https://www.google.com/s2/favicons?domain=perplexity.ai&sz=64" width="36" height="36" alt=""><br>Perplexity</a></td>
    <td align="center"><a href="./providers/@pinterest/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=pinterest.com&sz=64" width="36" height="36" alt=""><br>Pinterest</a></td>
    <td align="center"><a href="./providers/@piratebay/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=piratebay.com&sz=64" width="36" height="36" alt=""><br>Piratebay</a></td>
    <td align="center"><a href="./providers/@plaid/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=plaid.com&sz=64" width="36" height="36" alt=""><br>Plaid</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@planetscale/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=planetscale.com&sz=64" width="36" height="36" alt=""><br>Planetscale</a></td>
    <td align="center"><a href="./providers/@playstation/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=playstation.com&sz=64" width="36" height="36" alt=""><br>Playstation</a></td>
    <td align="center"><a href="./providers/@polymarket/api-emulator.mjs"><img src="https://www.google.com/s2/favicons?domain=polymarket.com&sz=64" width="36" height="36" alt=""><br>Polymarket</a></td>
    <td align="center"><a href="./providers/@postbridge/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=postbridge.com&sz=64" width="36" height="36" alt=""><br>Postbridge</a></td>
    <td align="center"><a href="./providers/@posthog/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=posthog.com&sz=64" width="36" height="36" alt=""><br>PostHog</a></td>
    <td align="center"><a href="./providers/@prime-music/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=music.amazon.com&sz=64" width="36" height="36" alt=""><br>Prime Music</a></td>
    <td align="center"><a href="./providers/@privy/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=privy.com&sz=64" width="36" height="36" alt=""><br>Privy</a></td>
    <td align="center"><a href="./providers/@progressive/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=progressive.com&sz=64" width="36" height="36" alt=""><br>Progressive</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@proton-mail/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=proton.me&sz=64" width="36" height="36" alt=""><br>Proton Mail</a></td>
    <td align="center"><a href="./providers/@qualtrics/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=qualtrics.com&sz=64" width="36" height="36" alt=""><br>Qualtrics</a></td>
    <td align="center"><a href="./providers/@quizlet/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=quizlet.com&sz=64" width="36" height="36" alt=""><br>Quizlet</a></td>
    <td align="center"><a href="./providers/@rackspace/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=rackspace.com&sz=64" width="36" height="36" alt=""><br>Rackspace</a></td>
    <td align="center"><a href="./providers/@ramp/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=ramp.com&sz=64" width="36" height="36" alt=""><br>Ramp</a></td>
    <td align="center"><a href="./providers/@reddit/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=reddit.com&sz=64" width="36" height="36" alt=""><br>Reddit</a></td>
    <td align="center"><a href="./providers/@reducto/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=reducto.com&sz=64" width="36" height="36" alt=""><br>Reducto</a></td>
    <td align="center"><a href="./providers/@render/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=render.com&sz=64" width="36" height="36" alt=""><br>Render</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@rentahuman/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=rentahuman.com&sz=64" width="36" height="36" alt=""><br>Rentahuman</a></td>
    <td align="center"><a href="./providers/@replicate/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=replicate.com&sz=64" width="36" height="36" alt=""><br>Replicate</a></td>
    <td align="center"><a href="./providers/@replit/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=replit.com&sz=64" width="36" height="36" alt=""><br>Replit</a></td>
    <td align="center"><a href="./providers/@resend/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=resend.com&sz=64" width="36" height="36" alt=""><br>Resend</a></td>
    <td align="center"><a href="./providers/@retool/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=retool.com&sz=64" width="36" height="36" alt=""><br>Retool</a></td>
    <td align="center"><a href="./providers/@rippling/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=rippling.com&sz=64" width="36" height="36" alt=""><br>Rippling</a></td>
    <td align="center"><a href="./providers/@robinhood-banking/README.md"><img src="https://www.google.com/s2/favicons?domain=robinhoodbanking.com&sz=64" width="36" height="36" alt=""><br>Robinhood Banking</a></td>
    <td align="center"><a href="./providers/@robinhood-trading/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=robinhoodtrading.com&sz=64" width="36" height="36" alt=""><br>Robinhood Trading</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@rocketchat/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=rocketchat.com&sz=64" width="36" height="36" alt=""><br>Rocketchat</a></td>
    <td align="center"><a href="./providers/@salesforce/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=salesforce.com&sz=64" width="36" height="36" alt=""><br>Salesforce</a></td>
    <td align="center"><a href="./providers/@samsara/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=samsara.com&sz=64" width="36" height="36" alt=""><br>Samsara</a></td>
    <td align="center"><a href="./providers/@scaleway/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=scaleway.com&sz=64" width="36" height="36" alt=""><br>Scaleway</a></td>
    <td align="center"><a href="./providers/@schwab/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=schwab.com&sz=64" width="36" height="36" alt=""><br>Schwab</a></td>
    <td align="center"><a href="./providers/@sec/api-emulator.mjs"><img src="https://www.google.com/s2/favicons?domain=sec.gov&sz=64" width="36" height="36" alt=""><br>SEC</a></td>
    <td align="center"><a href="./providers/@sentry/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=sentry.com&sz=64" width="36" height="36" alt=""><br>Sentry</a></td>
    <td align="center"><a href="./providers/@servicenow/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=servicenow.com&sz=64" width="36" height="36" alt=""><br>ServiceNow</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@setlistfm/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=setlistfm.com&sz=64" width="36" height="36" alt=""><br>Setlistfm</a></td>
    <td align="center"><a href="./providers/@shazam/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=shazam.com&sz=64" width="36" height="36" alt=""><br>Shazam</a></td>
    <td align="center"><a href="./providers/@shipstation/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=shipstation.com&sz=64" width="36" height="36" alt=""><br>Shipstation</a></td>
    <td align="center"><a href="./providers/@shopify/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=shopify.com&sz=64" width="36" height="36" alt=""><br>Shopify</a></td>
    <td align="center"><a href="./providers/@sierra/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=sierra.com&sz=64" width="36" height="36" alt=""><br>Sierra</a></td>
    <td align="center"><a href="./providers/@signal-messaging/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=signalmessaging.com&sz=64" width="36" height="36" alt=""><br>Signal Messaging</a></td>
    <td align="center"><a href="./providers/@silurian/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=silurian.com&sz=64" width="36" height="36" alt=""><br>Silurian</a></td>
    <td align="center"><a href="./providers/@siriusxm/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=siriusxm.com&sz=64" width="36" height="36" alt=""><br>Siriusxm</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@skyscanner/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=skyscanner.com&sz=64" width="36" height="36" alt=""><br>Skyscanner</a></td>
    <td align="center"><a href="./providers/@slack/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=slack.com&sz=64" width="36" height="36" alt=""><br>Slack</a></td>
    <td align="center"><a href="./providers/@snap/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=snap.com&sz=64" width="36" height="36" alt=""><br>Snap</a></td>
    <td align="center"><a href="./providers/@snappr/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=snappr.com&sz=64" width="36" height="36" alt=""><br>Snappr</a></td>
    <td align="center"><a href="./providers/@snowflake/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=snowflake.com&sz=64" width="36" height="36" alt=""><br>Snowflake</a></td>
    <td align="center"><a href="./providers/@sourcegraph/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=sourcegraph.com&sz=64" width="36" height="36" alt=""><br>Sourcegraph</a></td>
    <td align="center"><a href="./providers/@spark/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=spark.com&sz=64" width="36" height="36" alt=""><br>Spark</a></td>
    <td align="center"><a href="./providers/@spectrum/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=spectrum.com&sz=64" width="36" height="36" alt=""><br>Spectrum</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@spotify/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=spotify.com&sz=64" width="36" height="36" alt=""><br>Spotify</a></td>
    <td align="center"><a href="./providers/@stainless/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=stainless.com&sz=64" width="36" height="36" alt=""><br>Stainless</a></td>
    <td align="center"><a href="./providers/@statefarm/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=statefarm.com&sz=64" width="36" height="36" alt=""><br>Statefarm</a></td>
    <td align="center"><a href="./providers/@steam/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=steam.com&sz=64" width="36" height="36" alt=""><br>Steam</a></td>
    <td align="center"><a href="./providers/@stripe/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=stripe.com&sz=64" width="36" height="36" alt=""><br>Stripe</a></td>
    <td align="center"><a href="./providers/@substack/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=substack.com&sz=64" width="36" height="36" alt=""><br>Substack</a></td>
    <td align="center"><a href="./providers/@suno/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=suno.com&sz=64" width="36" height="36" alt=""><br>Suno</a></td>
    <td align="center"><a href="./providers/@supabase/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=supabase.com&sz=64" width="36" height="36" alt=""><br>Supabase</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@surveymonkey/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=surveymonkey.com&sz=64" width="36" height="36" alt=""><br>Surveymonkey</a></td>
    <td align="center"><a href="./providers/@symbolab/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=symbolab.com&sz=64" width="36" height="36" alt=""><br>Symbolab</a></td>
    <td align="center"><a href="./providers/@telegram/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=telegram.org&sz=64" width="36" height="36" alt=""><br>Telegram</a></td>
    <td align="center"><a href="./providers/@ticketmaster/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=ticketmaster.com&sz=64" width="36" height="36" alt=""><br>Ticketmaster</a></td>
    <td align="center"><a href="./providers/@tiktok/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=tiktok.com&sz=64" width="36" height="36" alt=""><br>Tiktok</a></td>
    <td align="center"><a href="./providers/@togetherai/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=together.ai&sz=64" width="36" height="36" alt=""><br>Togetherai</a></td>
    <td align="center"><a href="./providers/@truemed/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=truemed.com&sz=64" width="36" height="36" alt=""><br>Truemed</a></td>
    <td align="center"><a href="./providers/@tryprofound/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=tryprofound.com&sz=64" width="36" height="36" alt=""><br>Tryprofound</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@turbotax/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=turbotax.com&sz=64" width="36" height="36" alt=""><br>Turbotax</a></td>
    <td align="center"><a href="./providers/@twilio/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=twilio.com&sz=64" width="36" height="36" alt=""><br>Twilio</a></td>
    <td align="center"><a href="./providers/@uber/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=uber.com&sz=64" width="36" height="36" alt=""><br>Uber</a></td>
    <td align="center"><a href="./providers/@uipath/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=uipath.com&sz=64" width="36" height="36" alt=""><br>Uipath</a></td>
    <td align="center"><a href="./providers/@unifygtm/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=unifygtm.com&sz=64" width="36" height="36" alt=""><br>Unifygtm</a></td>
    <td align="center"><a href="./providers/@unity-ads/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=unity.com&sz=64" width="36" height="36" alt=""><br>Unity ADS</a></td>
    <td align="center"><a href="./providers/@upcloud/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=upcloud.com&sz=64" width="36" height="36" alt=""><br>Upcloud</a></td>
    <td align="center"><a href="./providers/@upstash/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=upstash.com&sz=64" width="36" height="36" alt=""><br>Upstash</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@usaa/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=usaa.com&sz=64" width="36" height="36" alt=""><br>USAA</a></td>
    <td align="center"><a href="./providers/@uspto/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=uspto.com&sz=64" width="36" height="36" alt=""><br>Uspto</a></td>
    <td align="center"><a href="./providers/@vercel/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=vercel.com&sz=64" width="36" height="36" alt=""><br>Vercel</a></td>
    <td align="center"><a href="./providers/@vultr/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=vultr.com&sz=64" width="36" height="36" alt=""><br>Vultr</a></td>
    <td align="center"><a href="./providers/@weatherkit/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=developer.apple.com&sz=64" width="36" height="36" alt=""><br>Weatherkit</a></td>
    <td align="center"><a href="./providers/@whatsapp/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=whatsapp.com&sz=64" width="36" height="36" alt=""><br>Whatsapp</a></td>
    <td align="center"><a href="./providers/@whoop/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=whoop.com&sz=64" width="36" height="36" alt=""><br>Whoop</a></td>
    <td align="center"><a href="./providers/@wikipedia/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=wikipedia.org&sz=64" width="36" height="36" alt=""><br>Wikipedia</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@wolfram/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=wolframalpha.com&sz=64" width="36" height="36" alt=""><br>Wolfram</a></td>
    <td align="center"><a href="./providers/@workato/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=workato.com&sz=64" width="36" height="36" alt=""><br>Workato</a></td>
    <td align="center"><a href="./providers/@workday/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=workday.com&sz=64" width="36" height="36" alt=""><br>Workday</a></td>
    <td align="center"><a href="./providers/@x/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=x.com&sz=64" width="36" height="36" alt=""><br>X</a></td>
    <td align="center"><a href="./providers/@xbow/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=xbow.com&sz=64" width="36" height="36" alt=""><br>Xbow</a></td>
    <td align="center"><a href="./providers/@xbox/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=xbox.com&sz=64" width="36" height="36" alt=""><br>Xbox</a></td>
    <td align="center"><a href="./providers/@yahoo-finance/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=yahoofinance.com&sz=64" width="36" height="36" alt=""><br>Yahoo Finance</a></td>
    <td align="center"><a href="./providers/@youtube/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=youtube.com&sz=64" width="36" height="36" alt=""><br>Youtube</a></td>
  </tr>
  <tr>
    <td align="center"><a href="./providers/@youtube-music/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=music.youtube.com&sz=64" width="36" height="36" alt=""><br>Youtube Music</a></td>
    <td align="center"><a href="./providers/@zapier/api-emulator/README.md"><img src="https://www.google.com/s2/favicons?domain=zapier.com&sz=64" width="36" height="36" alt=""><br>Zapier</a></td>
  </tr>
</table>
<!-- provider-wall:end -->


## License

MIT. See [`LICENSE`](./LICENSE).
