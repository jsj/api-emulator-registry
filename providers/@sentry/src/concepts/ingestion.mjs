import { issueFromEvent } from './issues.mjs';
import { now } from '../store.mjs';

export function sentryKey(c) {
  const queryKey = c.req.query?.('sentry_key');
  const header = c.req.header?.('x-sentry-auth') ?? c.req.header?.('authorization') ?? '';
  return queryKey ?? header.match(/sentry_key=([^,\s]+)/i)?.[1] ?? header.match(/^Bearer\s+(.+)$/i)?.[1] ?? null;
}

export function authenticate(state, projectId, c) {
  const allowed = state.projectKeys[String(projectId)] ?? [];
  return allowed.includes(sentryKey(c));
}

export function parseEnvelope(text) {
  const lines = String(text).split('\n');
  const headerText = lines.shift();
  if (!headerText) throw new Error('envelope header is required');
  const header = JSON.parse(headerText);
  const items = [];

  while (lines.length > 0) {
    const itemHeaderText = lines.shift();
    if (!itemHeaderText) continue;
    const itemHeader = JSON.parse(itemHeaderText);
    const payloadText = lines.shift() ?? '';
    let payload = payloadText;
    if (itemHeader.type === 'event' || itemHeader.type === 'transaction') {
      payload = JSON.parse(payloadText || '{}');
    }
    items.push({ header: itemHeader, payload });
  }

  return { header, items };
}

export function normalizeEvent(payload, envelopeHeader, projectId) {
  const eventId = payload.event_id ?? envelopeHeader.event_id ?? crypto.randomUUID().replaceAll('-', '');
  return {
    ...payload,
    event_id: eventId,
    projectId: String(projectId),
    receivedAt: now(),
  };
}

export function saveEvent(state, event) {
  const key = `${event.projectId}:${event.event_id}`;
  if (state.eventIds[key]) return { event: state.eventIds[key], duplicate: true, issue: null };
  state.eventIds[key] = event;
  state.events.push(event);
  const issue = issueFromEvent(state, event, event.projectId);
  event.issueId = issue.id;
  return { event, duplicate: false, issue };
}
