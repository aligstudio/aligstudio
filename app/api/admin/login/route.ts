import { NextResponse } from 'next/server';
import {
  createSessionToken,
  getAdminPassword,
  isSameOrigin,
  passwordMatches,
  SESSION_COOKIE,
  sessionCookieOptions
} from '@/lib/auth';

export const runtime = 'nodejs';

type Attempt = { count: number; first: number };
const attempts = new Map<string, Attempt>();
const WINDOW = 10 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'local';
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, message: 'Geçersiz istek.' }, { status: 403 });
  }

  if (!getAdminPassword()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          'Panel şifresi tanımlı değil. Vercel ortam değişkenlerine ADMIN_PASSWORD ekleyin.'
      },
      { status: 503 }
    );
  }

  const ip = clientIp(request);
  const now = Date.now();
  for (const [key, value] of attempts) {
    if (now - value.first > WINDOW) attempts.delete(key);
  }
  if (attempts.size > 5000) attempts.clear();
  const attempt = attempts.get(ip);
  if (attempt && now - attempt.first < WINDOW && attempt.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { ok: false, message: 'Çok fazla deneme. 10 dakika sonra tekrar dene.' },
      { status: 429 }
    );
  }

  let input = '';
  try {
    const body = (await request.json()) as { password?: unknown };
    input = typeof body.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ ok: false, message: 'Geçersiz istek.' }, { status: 400 });
  }

  if (!passwordMatches(input)) {
    if (!attempt || now - attempt.first >= WINDOW) {
      attempts.set(ip, { count: 1, first: now });
    } else {
      attempt.count += 1;
    }
    await new Promise((resolve) => setTimeout(resolve, 450));
    return NextResponse.json(
      { ok: false, message: 'Şifre hatalı. Tekrar deneyin.' },
      { status: 401 }
    );
  }

  attempts.delete(ip);
  const token = createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
