import { NextResponse } from 'next/server';
import { isSameOrigin } from '@/lib/auth';
import { getContent } from '@/lib/content';
import { addMessage } from '@/lib/inbox';
import { escapeHtml } from '@/lib/utils';

export const runtime = 'nodejs';

type Payload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  topic?: unknown;
  message?: unknown;
  website?: unknown;
};

const attempts = new Map<string, { count: number; first: number }>();
const WINDOW = 10 * 60 * 1000;
const MAX_ATTEMPTS = 6;

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'local';
}

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, message: 'Geçersiz istek.' }, { status: 403 });
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
      { ok: false, message: 'Çok fazla mesaj gönderildi. Biraz sonra tekrar dene.' },
      { status: 429 }
    );
  }

  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, message: 'Geçersiz istek.' }, { status: 400 });
  }

  // Honeypot: bots fill every field. Pretend it worked.
  if (clean(payload.website, 100)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 200);
  const company = clean(payload.company, 140);
  const topic = clean(payload.topic, 100) || 'Genel';
  const message = clean(payload.message, 5000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, message: 'Ad, e-posta ve mesaj alanları zorunlu.' },
      { status: 422 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, message: 'Geçerli bir e-posta yaz.' }, { status: 422 });
  }

  if (message.length < 10) {
    return NextResponse.json(
      { ok: false, message: 'Mesaj biraz daha detaylı olmalı.' },
      { status: 422 }
    );
  }

  attempts.set(ip, {
    count: (attempt && now - attempt.first < WINDOW ? attempt.count : 0) + 1,
    first: attempt && now - attempt.first < WINDOW ? attempt.first : now
  });

  // 1) The brief is ALWAYS stored in the admin inbox first — never lost,
  //    even when no e-mail provider is configured.
  let stored = true;
  try {
    await addMessage({ name, email, company, topic, message });
  } catch (error) {
    stored = false;
    console.error('[contact] Brief gelen kutusuna kaydedilemedi:', error);
  }

  // 2) E-mail delivery is best-effort on top of the inbox record.
  const apiKey = process.env.RESEND_API_KEY;
  let mailed = false;
  if (apiKey) {
    const content = await getContent();
    const to = process.env.CONTACT_TO_EMAIL || content.contact.email;
    const from = process.env.CONTACT_FROM_EMAIL || 'ALIG Studio <onboarding@resend.dev>';
    const subjectName = name.replace(/[\r\n]+/g, ' ');
    const subjectTopic = topic.replace(/[\r\n]+/g, ' ');

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#111">
        <h2 style="margin:0 0 16px">Yeni brief — ${escapeHtml(topic)}</h2>
        <p><strong>Ad:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-posta:</strong> ${escapeHtml(email)}</p>
        ${company ? `<p><strong>Marka / Şirket:</strong> ${escapeHtml(company)}</p>` : ''}
        <p><strong>Konu:</strong> ${escapeHtml(topic)}</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:20px 0" />
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `;

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `Yeni brief: ${subjectTopic} — ${subjectName}`,
          html
        }),
        signal: AbortSignal.timeout(12000)
      });

      if (response.ok) {
        mailed = true;
      } else {
        const detail = await response.text().catch(() => '');
        console.error('[contact] Resend hatası:', response.status, detail.slice(0, 500));
      }
    } catch (error) {
      console.error('[contact] Gönderim hatası:', error);
    }
  }

  // The message lives in the admin inbox either way; only report failure when
  // BOTH the inbox and the e-mail delivery failed.
  if (!stored && !mailed) {
    return NextResponse.json(
      { ok: false, message: 'Mesaj gönderilemedi. Doğrudan e-posta yazabilirsin.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, mailed });
}
