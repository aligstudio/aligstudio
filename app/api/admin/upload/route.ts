import { NextResponse } from 'next/server';
import { isAdminRequest, isSameOrigin } from '@/lib/auth';
import { saveUpload } from '@/lib/storage';

export const runtime = 'nodejs';

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

function detectImageMime(bytes: Uint8Array): string | null {
  if (bytes.length < 12) return null;

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'image/png';
  }

  // GIF: GIF87a or GIF89a
  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38 &&
    (bytes[4] === 0x37 || bytes[4] === 0x39) &&
    bytes[5] === 0x61
  ) {
    return 'image/gif';
  }

  // WebP: RIFF....WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp';
  }

  // AVIF: ....ftypavif / ....ftypavis / ....ftypmif1
  if (
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70
  ) {
    const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (brand === 'avif' || brand === 'avis' || brand === 'mif1') {
      return 'image/avif';
    }
  }

  return null;
}

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

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: 'Dosya okunamadı.' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: 'Dosya seçilmedi.' }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, message: 'Görsel en fazla 4 MB olabilir.' },
      { status: 413 }
    );
  }

  const headerBytes = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  const detectedMime = detectImageMime(headerBytes);

  if (!detectedMime || !ALLOWED.includes(detectedMime)) {
    return NextResponse.json(
      { ok: false, message: 'Yalnızca geçerli JPG, PNG, WebP, GIF veya AVIF yükleyebilirsin.' },
      { status: 415 }
    );
  }

  try {
    const url = await saveUpload(file, detectedMime);
    return NextResponse.json({ ok: true, url });
  } catch (error) {
    console.error('[admin] Görsel yüklenemedi:', error);
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : 'Görsel yüklenemedi. Depolamayı kontrol et.'
      },
      { status: 500 }
    );
  }
}
