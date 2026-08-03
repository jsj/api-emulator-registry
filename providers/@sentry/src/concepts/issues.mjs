import { now } from '../store.mjs';

export function makeIssue(state, overrides = {}) {
  const id = String(overrides.id ?? state.nextIssueId++);
  const title = overrides.title ?? 'Fatal error: Portfolio view crashed';
  return {
    id,
    shortId: overrides.shortId ?? `VIBETRADE-${id}`,
    title,
    culprit: overrides.culprit ?? 'PortfolioBreakdown.render',
    permalink: overrides.permalink ?? `https://sentry.local/organizations/vibetrade/issues/${id}/`,
    level: overrides.level ?? 'error',
    platform: overrides.platform ?? 'swift',
    project: overrides.project ?? { slug: 'vibetrade-ios' },
    metadata: {
      type: overrides.metadata?.type ?? 'NSInvalidArgumentException',
      value: overrides.metadata?.value ?? title,
      filename: overrides.metadata?.filename ?? 'PortfolioBreakdown.swift',
      function: overrides.metadata?.function ?? 'render',
      ...overrides.metadata,
    },
    firstSeen: overrides.firstSeen ?? now(),
    lastSeen: overrides.lastSeen ?? now(),
  };
}

export function issueWebhookPayload(issue, action = 'created') {
  return {
    action,
    installation: { uuid: 'sentry-emulator-installation' },
    actor: { type: 'application', id: 'sentry-emulator', name: 'Sentry Emulator' },
    data: { issue },
  };
}

function fingerprintPart(event) {
  const exception = event.exception?.values?.[0] ?? {};
  const frames = exception.stacktrace?.frames ?? event.stacktrace?.frames ?? [];
  const frame = frames.at(-1) ?? {};
  return [
    exception.type ?? event.type ?? 'Error',
    exception.value ?? event.message ?? '',
    frame.filename ?? frame.abs_path ?? '',
    frame.function ?? '',
  ].join('|');
}

function stableHash(value) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function eventFingerprint(event) {
  const explicitParts = Array.isArray(event.fingerprint) ? event.fingerprint : [event.fingerprint];
  const explicit = explicitParts.filter((part) => part && part !== '{{ default }}').join('|');
  return stableHash(explicit || fingerprintPart(event));
}

export function issueFromEvent(state, event, projectId) {
  const fingerprint = eventFingerprint(event);
  let issue = state.issues.find((candidate) => candidate.projectId === projectId && candidate.fingerprint === fingerprint);
  const seenAt = event.timestamp ?? event.receivedAt ?? now();
  if (issue) {
    issue.lastSeen = seenAt;
    issue.count += 1;
    issue.status = issue.status === 'resolved' ? 'unresolved' : issue.status;
    return issue;
  }

  const exception = event.exception?.values?.[0] ?? {};
  issue = {
    ...makeIssue(state, {
      title: exception.value ?? event.message ?? event.logentry?.formatted ?? 'Unknown error',
      level: event.level ?? 'error',
      platform: event.platform ?? 'other',
      project: { slug: String(projectId) },
      firstSeen: seenAt,
      lastSeen: seenAt,
      metadata: {
        type: exception.type ?? event.type ?? 'Error',
        value: exception.value ?? event.message ?? '',
      },
    }),
    projectId,
    fingerprint,
    status: 'unresolved',
    count: 1,
  };
  state.issues.push(issue);
  return issue;
}
