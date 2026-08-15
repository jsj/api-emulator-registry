# Sendblue API emulator

This provider emulates a stateful subset of the Sendblue API.

## Run

```bash
npx -p api-emulator api --plugin ./providers/@sendblue/api-emulator.mjs --service sendblue
```

Set `SENDBLUE_API_BASE_URL` to the local URL. Use local values for the API key and secret.

## Endpoints

- `POST /api/send-message` sends one message.
- `GET /api/v2/messages` lists messages.
- `GET /api/v2/messages/:messageId` returns one message.
- `GET /api/status` returns one message status.
- `GET /api/evaluate-service` returns the service for a phone number.
- The interaction routes support typing indicators, reactions, read receipts, groups, and carousels.
- `/api/v2/contacts` supports contact create, list, read, update, and delete operations.
- `POST /api/v2/contacts/opt-out` changes the opt-out state of a contact.
- `GET /api/lines` lists the local phone lines.
- `/api/account/webhooks` supports webhook list, create, replace, and delete operations.

## Seed configuration

```yaml
sendblue:
  lines:
    - id: line_emulator_001
      phone_number: "+15555550100"
      status: active
  contacts:
    - number: "+15555550101"
      first_name: Example
```

## Links

- [Official API reference](https://docs.sendblue.com/api/)
- [Official TypeScript SDK](https://github.com/sendblue-api/sendblue-ts)
- [api-emulator](https://github.com/jsj/api-emulator)

## Tests

```bash
node providers/@sendblue/smoke.mjs
node providers/@sendblue/sdk-smoke.mjs
```
