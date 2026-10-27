import { NextResponse } from 'next/server';
import { isAdminRequest, isSameOrigin } from '@/lib/auth';
import { deleteMessages, listMessages, setRead, unreadCount } from '@/lib/inbox';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false, message: 'Oturum sona ermiş.' }, { status: 401 });
  }
  const messages = await listMessages();
  return NextResponse.json({
    ok: true,
    messages,
    unread: unreadCount(messages)
  });
}

type ActionPayload = {
  action?: unknown;
  ids?: unknown;
};

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json(
      { ok: false, message: 'Oturum sona ermiş. Tekrar giriş yap.' },
      { status: 401 }
    );
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, message: 'Geçersiz istek.' }, { status: 403 });
  }

  let payload: ActionPayload;
  try {
    payload = (await request.json()) as ActionPayload;
  } catch {
    return NextResponse.json({ ok: false, message: 'Geçersiz veri.' }, { status: 400 });
  }

  const action = typeof payload.action === 'string' ? payload.action : '';
  const rawIds = payload.ids;
  const ids: string[] | 'all' =
    rawIds === 'all'
      ? 'all'
      : Array.isArray(rawIds)
        ? rawIds.filter((id): id is string => typeof id === 'string' && id.length > 0).slice(0, 500)
        : [];

  if (ids !== 'all' && ids.length === 0) {
    return NextResponse.json({ ok: false, message: 'Mesaj seçilmedi.' }, { status: 422 });
  }

  try {
    if (action === 'read' || action === 'unread') {
      const changed = await setRead(ids, action === 'read');
      return NextResponse.json({ ok: true, changed });
    }

    if (action === 'delete') {
      const removed = await deleteMessages(ids);
      return NextResponse.json({ ok: true, removed });
    }

    return NextResponse.json({ ok: false, message: 'Geçersiz işlem.' }, { status: 400 });
  } catch (error) {
    console.error('[inbox] İşlem başarısız:', error);
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : 'İşlem tamamlanamadı. Depolamayı kontrol et.'
      },
      { status: 500 }
    );
  }
}
