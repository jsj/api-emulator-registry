# Linq API emulator

This provider emulates a stateful subset of the Linq Partner API v3.

## Run

```bash
npx -p api-emulator api --plugin ./providers/@linq/api-emulator.mjs --service linq
```

Set `LINQ_API_V3_BASE_URL` to the local emulator URL. Use any nonempty value for `LINQ_API_V3_API_KEY`.

## Endpoints

- `GET /v3/phone_numbers` lists the local phone numbers.
- `GET /v3/chats` lists the local chats.
- `POST /v3/chats` creates a chat and sends its first message.
- `GET /v3/chats/:chatId` returns one chat.
- `PUT /v3/chats/:chatId` updates one chat.
- `GET /v3/chats/:chatId/messages` lists the messages in a chat.
- `POST /v3/chats/:chatId/messages` sends a message.
- `POST /v3/messages` sends a message with automatic line and chat selection.
- `POST /v3/attachments` creates a presigned-upload fixture.
- `GET /v3/attachments/:attachmentId` returns attachment metadata.
- `DELETE /v3/attachments/:attachmentId` deletes an attachment.
- `GET /v3/messages/:messageId` returns one message.
- `PATCH /v3/messages/:messageId` updates one message.
- `DELETE /v3/messages/:messageId` deletes one message.
- `GET /v3/webhook_subscriptions` lists the webhook subscriptions.
- `POST /v3/webhook_subscriptions` creates a webhook subscription.
- `GET /v3/webhook_subscriptions/:subscriptionId` returns one webhook subscription.
- `PUT /v3/webhook_subscriptions/:subscriptionId` updates one webhook subscription.
- `DELETE /v3/webhook_subscriptions/:subscriptionId` deletes one webhook subscription.

Only Partner API v3 is emulated. Legacy `/api/partner/v2` routes and `X-LINQ-INTEGRATION-TOKEN` authentication are intentionally unsupported.

The provider also accepts the canonical `/api/partner/v3` prefix.

## Seed configuration

```yaml
linq:
  phone_numbers:
    - id: 00000000-0000-4000-8000-000000002001
      phone_number: "+12025550100"
      forwarding_number: null
  chats:
    - from: "+12025550100"
      to:
        - "+12025550101"
```

## Links

- [Official Linq API documentation](https://docs.linqapp.com/api/)
- [Official TypeScript SDK](https://github.com/linq-team/linq-node)
- [api-emulator](https://github.com/jsj/api-emulator)

## Tests

```bash
node providers/@linq/smoke.mjs
node providers/@linq/sdk-smoke.mjs
```
