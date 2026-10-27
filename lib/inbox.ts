import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  randomUUID
} from 'node:crypto';
import { readStoredInbox, writeStoredInbox } from './storage';
import { isPlainObject } from './utils';

/**
 * Brief messages contain personal data (name, e-mail, message text) and the
 * Vercel Blob store is publicly fetchable by URL. The inbox document is
 * therefore encrypted at rest with AES-256-GCM.
 *
 * Key material: ADMIN_SECRET (preferred, stable) → ADMIN_PASSWORD → a dev-only
 * fallback. TIP: set ADMIN_SECRET once and keep it stable; rotating it (or the
 * password when no ADMIN_SECRET is set) makes older briefs unreadable.
 */
function inboxKey(): Buffer {
  const secret =
    process.env.ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'alig-studio-development-secret-change-me';
  return createHash('sha256').update(`alig-inbox-v1:${secret}`).digest();
}

type EncryptedEnvelope = {
  v: 1;
  alg: 'aes-256-gcm';
  data: string;
};

function encryptDocument(plain: string): EncryptedEnvelope {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', inboxKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    v: 1,
    alg: 'aes-256-gcm',
    data: Buffer.concat([iv, tag, ciphertext]).toString('base64')
  };
}

/** Returns the plaintext document JSON, or null when decryption fails. */
function decryptDocument(stored: Record<string, unknown>): string | null {
  if (stored.v !== 1 || stored.alg !== 'aes-256-gcm' || typeof stored.data !== 'string') {
    return null;
  }
  try {
    const buf = Buffer.from(stored.data, 'base64');
    if (buf.length < 29) return null;
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const ciphertext = buf.subarray(28);
    const decipher = createDecipheriv('aes-256-gcm', inboxKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}

export type InboxMessage = {
  id: string;
  createdAt: string; // ISO
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
  read: boolean;
};

export type InboxDocument = {
  version: 1;
  messages: InboxMessage[];
};

const MAX_MESSAGES = 500;

function clean(value: unknown, max: number): string {
  return typeof value === 'string'
    ? value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max)
    : '';
}

function normalizeMessage(value: unknown): InboxMessage | null {
  if (!isPlainObject(value)) return null;
  const id = clean(value.id, 64);
  const name = clean(value.name, 120);
  const email = clean(value.email, 200);
  const message = clean(value.message, 5000);
  if (!id || !name || !email || !message) return null;

  const createdAtRaw = clean(value.createdAt, 40);
  const createdAt = Number.isNaN(Date.parse(createdAtRaw))
    ? new Date().toISOString()
    : new Date(createdAtRaw).toISOString();

  return {
    id,
    createdAt,
    name,
    email,
    company: clean(value.company, 140),
    topic: clean(value.topic, 100) || 'Genel',
    message,
    read: Boolean(value.read)
  };
}

function emptyDocument(): InboxDocument {
  return { version: 1, messages: [] };
}

async function loadDocument(): Promise<InboxDocument> {
  let stored: unknown = null;
  try {
    stored = await readStoredInbox();
  } catch (error) {
    console.error('[inbox] Gelen kutusu okunamadı.', error);
    return emptyDocument();
  }

  if (!isPlainObject(stored)) return emptyDocument();

  // Encrypted envelope (current) or legacy plaintext document.
  let payload: unknown = stored;
  if (stored.v === 1 && stored.alg === 'aes-256-gcm') {
    const plain = decryptDocument(stored);
    if (plain === null) {
      console.error('[inbox] Gelen kutusu çözülemedi. ADMIN_SECRET değişti mi?');
      return emptyDocument();
    }
    try {
      payload = JSON.parse(plain) as unknown;
    } catch {
      return emptyDocument();
    }
  }

  const raw = isPlainObject(payload) && Array.isArray(payload.messages) ? payload.messages : [];
  const messages = raw
    .map(normalizeMessage)
    .filter((item): item is InboxMessage => item !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { version: 1, messages };
}

async function saveDocument(document: InboxDocument): Promise<void> {
  await writeStoredInbox(encryptDocument(JSON.stringify(document)));
}

/** Newest first. */
export async function listMessages(): Promise<InboxMessage[]> {
  const document = await loadDocument();
  return document.messages;
}

export async function addMessage(input: {
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
}): Promise<InboxMessage> {
  const document = await loadDocument();
  const entry = normalizeMessage({
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    read: false,
    ...input
  });
  if (!entry) throw new Error('Geçersiz mesaj verisi.');

  document.messages.unshift(entry);
  // Keep the inbox bounded; the oldest messages are dropped first.
  if (document.messages.length > MAX_MESSAGES) {
    document.messages = document.messages.slice(0, MAX_MESSAGES);
  }
  await saveDocument(document);
  return entry;
}

export async function setRead(ids: string[] | 'all', read: boolean): Promise<number> {
  const document = await loadDocument();
  const wanted = ids === 'all' ? null : new Set(ids.map((id) => clean(id, 64)).filter(Boolean));
  let changed = 0;
  for (const message of document.messages) {
    if (wanted && !wanted.has(message.id)) continue;
    if (message.read !== read) {
      message.read = read;
      changed += 1;
    }
  }
  if (changed) await saveDocument(document);
  return changed;
}

export async function deleteMessages(ids: string[] | 'all'): Promise<number> {
  const document = await loadDocument();
  const before = document.messages.length;
  if (ids === 'all') {
    document.messages = [];
  } else {
    const wanted = new Set(ids.map((id) => clean(id, 64)).filter(Boolean));
    document.messages = document.messages.filter((message) => !wanted.has(message.id));
  }
  const removed = before - document.messages.length;
  if (removed) await saveDocument(document);
  return removed;
}

export function unreadCount(messages: InboxMessage[]): number {
  return messages.filter((message) => !message.read).length;
}
