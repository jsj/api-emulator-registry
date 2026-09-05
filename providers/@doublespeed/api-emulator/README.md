# @api-emulator/doublespeed

Stateful DoubleSpeed emulator for local social-posting, comments, templates, clone jobs, webhooks, account management, and Comment Monitor tests.

## Run

```bash
npx -p api-emulator api --plugin ./providers/@doublespeed/api-emulator.mjs --service doublespeed
```

Use any local `Authorization: Bearer <token>`. The emulator uses product `750aa38f-7f2e-466e-8199-35c50f9f740d` and never sends credentials to DoubleSpeed.

## Coverage

- Level: `smoke-only`
- Smoke: `node providers/@doublespeed/smoke.mjs`

## Links

- [Official DoubleSpeed API reference](https://doublespeed.ai/docs/api-reference)
- [api-emulator](https://github.com/jsj/api-emulator)
