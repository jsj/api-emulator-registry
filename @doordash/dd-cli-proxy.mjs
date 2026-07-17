#!/usr/bin/env node
// Local-only CONNECT proxy for dd-cli's fixed https://openapi.doordash.com host.
// It deliberately accepts no other destination and never logs authorization headers.
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import tls from 'node:tls';
import { readFileSync } from 'node:fs';

const port = Number(process.env.DD_CLI_PROXY_PORT ?? 8443);
const upstream = new URL(process.env.DD_CLI_EMULATOR_URL ?? 'http://127.0.0.1:4010');
const certPath = process.env.DD_CLI_PROXY_CERT;
const keyPath = process.env.DD_CLI_PROXY_KEY;

if (!certPath || !keyPath) {
  console.error('Set DD_CLI_PROXY_CERT and DD_CLI_PROXY_KEY to a local certificate for openapi.doordash.com.');
  process.exit(1);
}

const secureContext = tls.createSecureContext({ cert: readFileSync(certPath), key: readFileSync(keyPath) });
const requestUpstream = upstream.protocol === 'https:' ? https.request : http.request;

const target = http.createServer((req, res) => {
  const headers = { ...req.headers, host: upstream.host };
  delete headers['proxy-connection'];
  delete headers.connection;
  const outbound = requestUpstream({
    protocol: upstream.protocol,
    hostname: upstream.hostname,
    port: upstream.port || undefined,
    method: req.method,
    path: req.url,
    headers,
  }, (upstreamResponse) => {
    res.writeHead(upstreamResponse.statusCode ?? 502, upstreamResponse.headers);
    upstreamResponse.pipe(res);
  });
  outbound.on('error', () => {
    if (!res.headersSent) res.writeHead(502, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'Local emulator is unavailable' }));
  });
  req.pipe(outbound);
});

net.createServer((socket) => {
  let buffered = Buffer.alloc(0);
  const onData = (chunk) => {
    buffered = Buffer.concat([buffered, chunk]);
    const end = buffered.indexOf('\r\n\r\n');
    if (end < 0) {
      if (buffered.length > 8192) socket.destroy();
      return;
    }
    socket.removeListener('data', onData);
    const [requestLine] = buffered.subarray(0, end).toString('latin1').split('\r\n');
    const [, authority] = requestLine.split(' ');
    if (requestLine?.split(' ')[0] !== 'CONNECT' || authority !== 'openapi.doordash.com:443') {
      socket.end('HTTP/1.1 403 Forbidden\r\nContent-Length: 0\r\n\r\n');
      return;
    }
    socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    const client = new tls.TLSSocket(socket, { isServer: true, secureContext });
    client.on('error', () => socket.destroy());
    const remainder = buffered.subarray(end + 4);
    if (remainder.length) client.unshift(remainder);
    target.emit('connection', client);
  };
  socket.on('data', onData);
  socket.on('error', () => {});
}).listen(port, '127.0.0.1', () => {
  console.log(`dd-cli local proxy listening on http://127.0.0.1:${port} -> ${upstream.origin}`);
});
