import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'alig_studio_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7
};

/**
 * Production (Vercel / next start) vs. local development.
 * In development a well-known fallback keeps the flow usable; in production
 * NOTHING is fallback — missing configuration means the panel is locked.
 */
export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
}

function adminSecret(): string | null {
  const configured = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (configured) return configured;
  // Never sign production session cookies with a hard-coded secret.
  if (isProductionRuntime()) return null;
  return 'alig-studio-development-secret-change-me';
}

export function getAdminPassword(): string | null {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  // Production without ADMIN_PASSWORD must NOT fall back to a known password.
  if (isProductionRuntime()) return null;
  return 'aligstudio';
}

export function passwordMatches(input: string): boolean {
  const expected = getAdminPassword();
  if (!expected || !input) return false;
  const a = createHash('sha256').update(input, 'utf8').digest();
  const b = createHash('sha256').update(expected, 'utf8').digest();
  return timingSafeEqual(a, b);
}

/**
 * Strict Origin / Referer verification for state-changing API requests.
 * Rejects cross-site requests and requests that strip both Origin and Referer.
 */
export function isSameOrigin(request: Request): boolean {
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'none') {
    return false;
  }

  const expectedHost = (
    request.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ||
    request.headers.get('host') ||
    ''
  ).toLowerCase();

  if (!expectedHost) return false;

  const source = request.headers.get('origin') || request.headers.get('referer');
  if (!source) return false;

  try {
    return new URL(source).host.toLowerCase() === expectedHost;
  } catch {
    return false;
  }
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createSessionToken(): string {
  const secret = adminSecret();
  if (!secret) {
    throw new Error('ADMIN_SECRET veya ADMIN_PASSWORD tanımlı değil.');
  }
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + SESSION_TTL_MS }),
    'utf8'
  ).toString('base64url');
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  const secret = adminSecret();
  if (!secret || !token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = sign(payload, secret);
  const given = Buffer.from(signature);
  const want = Buffer.from(expected);
  if (given.length !== want.length || !timingSafeEqual(given, want)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      exp?: number;
    };
    return typeof data.exp === 'number' && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export const isAuthenticated = isAdminRequest;
