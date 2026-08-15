# @api-emulator/microsoft

This package emulates the Microsoft identity API and the Microsoft Graph v1.0 HTTP surface.

The package includes stateful routes and a generic OpenAPI fallback. The fallback accepts 17,531 operations from the official specification.

Use this emulator for local tests, continuous integration (CI), and offline agent runs. The emulator does not send requests to Microsoft.

## Install

1. Install the package.

```bash
npm install @api-emulator/microsoft
```

2. Start the emulator from this registry.

```bash
npx -p api-emulator api --plugin ./providers/@microsoft/api-emulator/src/index.ts --service microsoft
```

3. Set the base URL of the client to the local URL from `api-emulator`.

## API coverage

The emulator gives stateful responses for these Microsoft identity routes:

- `GET /.well-known/openid-configuration` returns the OpenID Connect metadata.
- `GET /:tenant/v2.0/.well-known/openid-configuration` returns the metadata for a tenant.
- `GET /discovery/v2.0/keys` returns the JSON Web Key Set (JWKS).
- `GET /oauth2/v2.0/authorize` returns the local sign-in page.
- `POST /oauth2/v2.0/authorize/callback` creates a local authorization code.
- `POST /oauth2/v2.0/token` creates or refreshes local tokens.
- `POST /:tenant/oauth2/token` creates a token through the legacy OAuth endpoint.
- `GET /oidc/userinfo` returns the local user information.
- `GET /oauth2/v2.0/logout` ends the local session.
- `POST /oauth2/v2.0/revoke` revokes a local token.

The emulator gives stateful responses for these Microsoft Graph routes:

- `GET /v1.0/me` returns the current user.
- `GET /v1.0/users/:id` returns one user.
- `GET /v1.0/me/joinedTeams` returns the teams of the current user.
- `GET /v1.0/teams/:teamId` returns one team.
- `GET /v1.0/teams/:teamId/channels` returns the channels in a team.
- `GET /v1.0/teams/:teamId/channels/:channelId/messages` returns the messages in a channel.
- `GET /v1.0/teams/:teamId/channels/:channelId/messages/:messageId` returns one channel message.
- `POST /v1.0/teams/:teamId/channels/:channelId/messages` sends one channel message.

The OpenAPI fallback accepts the other documented Microsoft Graph v1.0 operations.

The fallback supports `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` requests. It returns generic OData payloads or empty success responses.

## Fidelity

The stateful routes store users, OAuth clients, teams, channels, and channel messages. These routes return Microsoft-style payloads and errors.

The fallback does not reproduce Microsoft service behavior. It does not enforce all permissions, policies, query rules, pagination rules, or service limits.

The contract uses Microsoft Graph OpenAPI v1.0 at commit `bd05c95ec804b2eec35e787a524976b67f9a5e36`.

## Credentials

Production credentials are not necessary. Local credentials satisfy client credential requirements.

The emulator includes one default user, one team, one channel, and one channel message.

## Seed configuration

Add repeatable users, OAuth clients, teams, and channels to the provider configuration.

```yaml
microsoft:
  users:
    - email: user@example.com
      name: Example User
  oauth_clients:
    - client_id: local-client
      client_secret: local-secret
      name: Local Application
      redirect_uris:
        - http://localhost:3000/callback
  teams:
    - id: 00000000-0000-0000-0000-000000000042
      display_name: Product
      channels:
        - display_name: General
```

## Links

- [Microsoft Graph Teams API overview](https://learn.microsoft.com/graph/api/resources/teams-api-overview?view=graph-rest-1.0)
- [Microsoft Graph OpenAPI metadata](https://github.com/microsoftgraph/msgraph-metadata/tree/master/openapi/v1.0)
- [Microsoft identity platform documentation](https://learn.microsoft.com/entra/identity-platform/)
- [api-emulator](https://github.com/jsj/api-emulator)
