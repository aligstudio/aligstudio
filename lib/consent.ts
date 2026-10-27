import { randomUUID } from 'node:crypto';
import { readStoredConsent, writeStoredConsent } from './storage';
import { isPlainObject } from './utils';

/**
 * Cookie consent log ("Kabul Et" acknowledgements). The site only uses
 * strictly necessary cookies, so each event is just an acknowledgement — no
 * tracking identifiers, no IP addresses, no cross-site profiling.
 */
export type ConsentEvent = {
  id: string;
  createdAt: string; // ISO
  path: string;
  ua: string; // coarse client info (browser/OS hints only, truncated)
};

export type ConsentDocument = {
  version: 1;
  events: ConsentEvent[];
};

export type ConsentStats = {
  total: number;
  last7Days: number;
  today: number;
  byDay: { day: string; count: number }[];
};

const MAX_EVENTS = 1000;

function clean(value: unknown, max: number): string {
  return typeof value === 'string'
    ? value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max)
    : '';
}

function normalizeEvent(value: unknown): ConsentEvent | null {
  if (!isPlainObject(value)) return null;
  const id = clean(value.id, 64);
  if (!id) return null;

  const createdAtRaw = clean(value.createdAt, 40);
  const createdAt = Number.isNaN(Date.parse(createdAtRaw))
    ? new Date().toISOString()
    : new Date(createdAtRaw).toISOString();

  return {
    id,
    createdAt,
    path: clean(value.path, 200) || '/',
    ua: clean(value.ua, 160)
  };
}

function emptyDocument(): ConsentDocument {
  return { version: 1, events: [] };
}

async function loadDocument(): Promise<ConsentDocument> {
  let stored: unknown = null;
  try {
    stored = await readStoredConsent();
  } catch (error) {
    console.error('[consent] Çerez kayıtları okunamadı.', error);
    return emptyDocument();
  }

  if (!isPlainObject(stored)) return emptyDocument();
  const raw = Array.isArray(stored.events) ? stored.events : [];
  const events = raw
    .map(normalizeEvent)
    .filter((item): item is ConsentEvent => item !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { version: 1, events };
}

async function saveDocument(document: ConsentDocument): Promise<void> {
  await writeStoredConsent(document);
}

export async function recordConsent(input: {
  path?: string;
  ua?: string;
}): Promise<ConsentEvent> {
  const document = await loadDocument();
  const entry: ConsentEvent = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    path: clean(input.path, 200) || '/',
    ua: clean(input.ua, 160)
  };
  document.events.unshift(entry);
  if (document.events.length > MAX_EVENTS) {
    document.events = document.events.slice(0, MAX_EVENTS);
  }
  await saveDocument(document);
  return entry;
}

/** Newest first. */
export async function listConsentEvents(): Promise<ConsentEvent[]> {
  const document = await loadDocument();
  return document.events;
}

export async function clearConsentEvents(): Promise<number> {
  const document = await loadDocument();
  const removed = document.events.length;
  if (removed) {
    document.events = [];
    await saveDocument(document);
  }
  return removed;
}

export function consentStats(events: ConsentEvent[]): ConsentStats {
  const now = new Date();
  const dayKey = (date: Date) => date.toISOString().slice(0, 10);
  const todayKey = dayKey(now);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const counts = new Map<string, number>();
  let last7Days = 0;
  let today = 0;

  for (const event of events) {
    const date = new Date(event.createdAt);
    const key = dayKey(date);
    counts.set(key, (counts.get(key) || 0) + 1);
    if (date >= weekAgo) last7Days += 1;
    if (key === todayKey) today += 1;
  }

  const byDay = [...counts.entries()]
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => b.day.localeCompare(a.day))
    .slice(0, 14);

  return { total: events.length, last7Days, today, byDay };
}
