import { NextResponse } from 'next/server';
import { isSameOrigin } from '@/lib/auth';
import { recordConsent } from '@/lib/consent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Records a cookie-consent acknowledgement. Public endpoint — same-origin
 * only, and the payload deliberately carries no personal data.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  let path = '/';
  try {
    const body = (await request.json()) as { path?: unknown };
    if (typeof body?.path === 'string') path = body.path;
  } catch {
    /* body yoksa varsayılanla devam et */
  }

  try {
    await recordConsent({
      path,
      ua: request.headers.get('user-agent') || ''
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[consent] Onay kaydedilemedi:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
