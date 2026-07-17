# Running `dd-cli` against the local emulator

`dd-cli` v0.2.0 hard-codes `https://openapi.doordash.com/mcp/consumer`. The
local proxy below intercepts only that hostname and forwards it to the
DoorDash emulator; it does not contact DoorDash.

Start the emulator:

```bash
npx -p api-emulator api start --plugin ./@doordash/api-emulator.mjs --service doordash --port 4010 --no-notify
```

Create a short-lived local certificate (do not commit it):

```bash
mkdir -p /tmp/dd-cli-local-cert
openssl req -x509 -newkey rsa:2048 -nodes -days 7 \
  -keyout /tmp/dd-cli-local-cert/key.pem \
  -out /tmp/dd-cli-local-cert/cert.pem \
  -subj '/CN=openapi.doordash.com' \
  -addext 'subjectAltName=DNS:openapi.doordash.com'
```

In a second terminal, start the local-only CONNECT proxy:

```bash
DD_CLI_PROXY_CERT=/tmp/dd-cli-local-cert/cert.pem \
DD_CLI_PROXY_KEY=/tmp/dd-cli-local-cert/key.pem \
node ./@doordash/dd-cli-proxy.mjs
```

Run the unmodified CLI through it:

```bash
DD_CLI_CA_BUNDLE=/tmp/dd-cli-local-cert/cert.pem \
HTTPS_PROXY=http://127.0.0.1:8443 \
dd-cli --json-output search --query ramen
```

Set `DD_CLI_EMULATOR_URL` or `DD_CLI_PROXY_PORT` when the emulator or proxy
uses a different local port. The proxy accepts only
`openapi.doordash.com:443` and does not log credentials.
