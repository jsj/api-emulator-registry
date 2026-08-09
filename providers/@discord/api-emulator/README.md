# @api-emulator/discord

Discord provides community, messaging, guild, channel, bot, and interaction APIs.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/discord
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@discord/api-emulator/src/index.ts --service discord
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

The emulator covers the Discord API v10 routes used by `discord-agent`:

- Current bot, guild, channel, role, and member lookups
- Channel message listing and guild message search
- Member search
- Audit-log and AutoMod rule listing
- Role assignment and removal
- Member timeout, timeout removal, kick, and ban

The default fixture contains only synthetic identities (`simulation-bot`,
`sample-admin`, and `sample-member`) and generic operational messages. It does
not contain names, email addresses, phone numbers, or production identifiers.

## Coverage

- Level: `behavioral`
- Meaning: The `discord-agent` administration surface has Discord-compatible
  response shapes and stateful moderation behavior.
- Evidence: provider tests cover reads, search, mutations, and audit reasons.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
discord:
  bot_token: discord-emulator-bot-token
  guilds:
    - name: Simulation Guild
      channels:
        - name: general
      members:
        - username: sample-member
          nick: Sample Member
      messages:
        - channel: general
          author: sample-member
          content: This is a generic message for local simulation.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
