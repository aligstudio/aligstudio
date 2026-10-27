import { NextResponse } from 'next/server';
import { isAdminRequest, isSameOrigin } from '@/lib/auth';
import { clearConsentEvents, consentStats, listConsentEvents } from '@/lib/consent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const events = await listConsentEvents();
  return NextResponse.json({ ok: true, events, stats: consentStats(events) });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, message: 'Geçersiz istek.' }, { status: 403 });
  }

  let action = '';
  try {
    const body = (await request.json()) as { action?: unknown };
    if (typeof body?.action === 'string') action = body.action;
  } catch {
    return NextResponse.json({ ok: false, message: 'Geçersiz veri.' }, { status: 400 });
  }

  if (action === 'clear') {
    const removed = await clearConsentEvents();
    return NextResponse.json({ ok: true, removed });
  }

  return NextResponse.json({ ok: false, message: 'Bilinmeyen işlem.' }, { status: 400 });
}
