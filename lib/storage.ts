import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { SiteContent, StorageMode } from './types';

/**
 * Content is stored as a versioned JSON document.
 * - On Vercel it lives in Vercel Blob (BLOB_READ_WRITE_TOKEN).
 * - Locally it lives in .data/content.json so you can edit without any cloud setup.
 */
const CONTENT_PREFIX = 'aligstudio/data/content-';
const UPLOAD_PREFIX = 'aligstudio/uploads/';
const LOCAL_CONTENT_FILE = path.join(process.cwd(), '.data', 'content.json');
const INBOX_BLOB_PATH = 'aligstudio/data/inbox.json';
const LOCAL_INBOX_FILE = path.join(process.cwd(), '.data', 'inbox.json');

function getBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return process.env.BLOB_READ_WRITE_TOKEN;
  }
  for (const [key, val] of Object.entries(process.env)) {
    if (key.endsWith('_READ_WRITE_TOKEN') && val && val.startsWith('vercel_blob_rw_')) {
      return val;
    }
  }
  return undefined;
}

export function getStorageMode(): StorageMode {
  if (getBlobToken()) return 'blob';
  if (process.env.VERCEL) return 'locked';
  return 'local';
}

async function blobSdk() {
  return import('@vercel/blob');
}

function newestFirst<T extends { uploadedAt: Date | string }>(blobs: T[]): T[] {
  return [...blobs].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export async function readStoredContent(): Promise<unknown | null> {
  if (getStorageMode() === 'blob') {
    const token = getBlobToken();
    const { list } = await blobSdk();
    const { blobs } = await list({ prefix: CONTENT_PREFIX, limit: 100, token });
    if (!blobs.length) return null;
    const latest = newestFirst(blobs)[0];
    const response = await fetch(latest.url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Blob okunamadı (${response.status})`);
    return (await response.json()) as unknown;
  }

  if (getStorageMode() === 'local') {
    try {
      const raw = await fs.readFile(LOCAL_CONTENT_FILE, 'utf8');
      return JSON.parse(raw) as unknown;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw error;
    }
  }

  return null;
}

export async function writeStoredContent(content: SiteContent): Promise<void> {
  const mode = getStorageMode();
  const body = JSON.stringify(content, null, 2);

  if (mode === 'locked') {
    throw new Error(
      'İçerik deposu bağlı değil. Vercel projesine bir Blob store ekleyip BLOB_READ_WRITE_TOKEN ortam değişkenini tanımlayın.'
    );
  }

  if (mode === 'blob') {
    const token = getBlobToken();
    const { put, list, del } = await blobSdk();
    await put(`${CONTENT_PREFIX}${Date.now()}.json`, body, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      token
    });

    // Keep the last three snapshots; delete the rest so the store stays tidy.
    try {
      const { blobs } = await list({ prefix: CONTENT_PREFIX, limit: 100, token });
      const stale = newestFirst(blobs).slice(3);
      if (stale.length) await del(stale.map((blob) => blob.url), { token });
    } catch {
      // Cleanup is best-effort.
    }
    return;
  }

  await fs.mkdir(path.dirname(LOCAL_CONTENT_FILE), { recursive: true });
  await fs.writeFile(LOCAL_CONTENT_FILE, body, 'utf8');
}

const MIME_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif'
};

export async function saveUpload(file: File, verifiedMime?: string): Promise<string> {
  const mode = getStorageMode();
  const mime = verifiedMime || file.type;
  const ext = MIME_EXTENSIONS[mime] || '.jpg';
  const baseName = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(-60);
  const filename = `${Date.now()}-${baseName || 'gorsel'}${ext}`;

  if (mode === 'blob') {
    const token = getBlobToken();
    const { put } = await blobSdk();
    const blob = await put(`${UPLOAD_PREFIX}${filename}`, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: mime,
      token
    });
    return blob.url;
  }

  if (mode === 'local') {
    const dir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(dir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, filename), bytes);
    return `/uploads/${filename}`;
  }

  throw new Error(
    'Görsel deposu bağlı değil. Vercel Blob store ekleyip BLOB_READ_WRITE_TOKEN tanımlayın.'
  );
}

/**
 * Brief inbox (contact form submissions) is stored as a single JSON document
 * next to the content: Vercel Blob in production, .data/inbox.json locally.
 */
export async function readStoredInbox(): Promise<unknown | null> {
  if (getStorageMode() === 'blob') {
    const token = getBlobToken();
    const { list } = await blobSdk();
    const { blobs } = await list({ prefix: INBOX_BLOB_PATH, limit: 10, token });
    if (!blobs.length) return null;
    const latest = newestFirst(blobs)[0];
    const response = await fetch(latest.url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Gelen kutusu okunamadı (${response.status})`);
    return (await response.json()) as unknown;
  }

  if (getStorageMode() === 'local') {
    try {
      const raw = await fs.readFile(LOCAL_INBOX_FILE, 'utf8');
      return JSON.parse(raw) as unknown;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw error;
    }
  }

  return null;
}

export async function writeStoredInbox(data: unknown): Promise<void> {
  const mode = getStorageMode();
  const body = JSON.stringify(data, null, 2);

  if (mode === 'locked') {
    throw new Error(
      'İçerik deposu bağlı değil. Vercel projesine bir Blob store ekleyip BLOB_READ_WRITE_TOKEN ortam değişkenini tanımlayın.'
    );
  }

  if (mode === 'blob') {
    const token = getBlobToken();
    const { put } = await blobSdk();
    await put(INBOX_BLOB_PATH, body, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      token
    });
    return;
  }

  await fs.mkdir(path.dirname(LOCAL_INBOX_FILE), { recursive: true });
  await fs.writeFile(LOCAL_INBOX_FILE, body, 'utf8');
}


/**
 * Cookie consent log is stored as a single JSON document next to the inbox:
 * Vercel Blob in production, .data/consent.json locally. Records contain no
 * personal data (timestamp, page path, coarse client info) so — unlike the
 * inbox — the document is kept in plain JSON.
 */
const CONSENT_BLOB_PATH = 'aligstudio/data/consent.json';
const LOCAL_CONSENT_FILE = path.join(process.cwd(), '.data', 'consent.json');

export async function readStoredConsent(): Promise<unknown | null> {
  if (getStorageMode() === 'blob') {
    const token = getBlobToken();
    const { list } = await blobSdk();
    const { blobs } = await list({ prefix: CONSENT_BLOB_PATH, limit: 10, token });
    if (!blobs.length) return null;
    const latest = newestFirst(blobs)[0];
    const response = await fetch(latest.url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Çerez kayıtları okunamadı (${response.status})`);
    return (await response.json()) as unknown;
  }

  if (getStorageMode() === 'local') {
    try {
      const raw = await fs.readFile(LOCAL_CONSENT_FILE, 'utf8');
      return JSON.parse(raw) as unknown;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw error;
    }
  }

  return null;
}

export async function writeStoredConsent(data: unknown): Promise<void> {
  const mode = getStorageMode();
  const body = JSON.stringify(data, null, 2);

  if (mode === 'locked') {
    throw new Error(
      'İçerik deposu bağlı değil. Vercel projesine bir Blob store ekleyip BLOB_READ_WRITE_TOKEN ortam değişkenini tanımlayın.'
    );
  }

  if (mode === 'blob') {
    const token = getBlobToken();
    const { put } = await blobSdk();
    await put(CONSENT_BLOB_PATH, body, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      token
    });
    return;
  }

  await fs.mkdir(path.dirname(LOCAL_CONSENT_FILE), { recursive: true });
  await fs.writeFile(LOCAL_CONSENT_FILE, body, 'utf8');
}
