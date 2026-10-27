import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { isAdminRequest, isSameOrigin } from '@/lib/auth';
import { ContentValidationError, getContent, saveContent } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const content = await getContent();
  return NextResponse.json({ ok: true, content });
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json(
      { ok: false, message: 'Oturum sona ermiş. Tekrar giriş yap.' },
      { status: 401 }
    );
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, message: 'Geçersiz istek.' }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = (await request.json()) as { content?: unknown };
  } catch {
    return NextResponse.json({ ok: false, message: 'Geçersiz veri.' }, { status: 400 });
  }

  const content = (payload as { content?: unknown })?.content;

  try {
    const saved = await saveContent(content);
    revalidatePath('/', 'layout');
    return NextResponse.json({ ok: true, content: saved });
  } catch (error) {
    if (error instanceof ContentValidationError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 422 });
    }
    console.error('[admin] İçerik kaydedilemedi:', error);
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : 'İçerik kaydedilemedi. Depolama ayarlarını kontrol et.'
      },
      { status: 500 }
    );
  }
}
