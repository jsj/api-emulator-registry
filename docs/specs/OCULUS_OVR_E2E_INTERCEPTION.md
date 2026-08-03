# Oculus OVR E2E Interception

Real `ovr-platform-util get-release-channel-data --app-id 123456 --token dummy` was proven end-to-end against the local `@oculus` emulator by temporarily intercepting `https://graph.oculus.com` with `mkcert + caddy + /etc/hosts`.

This interception is intentionally off by default and should stay manual/gated because it requires admin changes to `/etc/hosts`, trusted local CA state, and a root listener on port 443.

## Re-enable manually

1. Ensure `mkcert` and `caddy` are installed.
2. Generate a local cert for `graph.oculus.com`.
3. Start the `@oculus` emulator on `127.0.0.1:8788`.
4. Start Caddy as admin on `graph.oculus.com:443`, using the generated cert and reverse-proxying to `127.0.0.1:8788`.
5. Add a temporary `/etc/hosts` entry: `127.0.0.1 graph.oculus.com`.
6. Run: `NODE_TLS_REJECT_UNAUTHORIZED=0 /usr/local/bin/ovr-platform-util get-release-channel-data --app-id 123456 --token dummy`.
7. Clean up by stopping Caddy/emulator, removing the hosts entry, and flushing DNS.
