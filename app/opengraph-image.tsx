import { ImageResponse } from 'next/og';
import { getContent } from '@/lib/content';
import { resolveImageSrc } from '@/lib/og-assets';
import { contrastInk, hexToRgb, SITE_URL } from '@/lib/utils';

export const runtime = 'nodejs';
export const alt = 'Yaratıcı teknoloji stüdyosu';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const content = await getContent();
  const accent = content.brand.accent;
  const bg = content.brand.bg || '#08090a';
  const textInk = content.brand.ink || '#f2f2ec';
  const muted = content.brand.muted || '#b3b8b1';
  const { r, g, b } = hexToRgb(accent);
  const accentInk = contrastInk(accent);
  const host = new URL(SITE_URL).host.replace(/^www\./, '').toUpperCase();
  const logoSrc = await resolveImageSrc(content.brand.logoImage);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          backgroundColor: bg,
          backgroundImage: `radial-gradient(900px 500px at 90% 0%, rgba(${r},${g},${b},0.16), transparent 60%)`,
          color: textInk,
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {logoSrc ? (
            <img
              src={logoSrc}
              alt=""
              style={{
                width: 56,
                height: 56,
                borderRadius: 999,
                objectFit: 'contain'
              }}
            />
          ) : (
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
                border: `1px solid ${accent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: accent,
                fontSize: 22
              }}
            >
              ✦
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: 2 }}>
              {content.brand.logoText}
            </span>
            <span style={{ fontSize: 11, letterSpacing: 4, color: muted }}>
              {content.brand.tagline.toLocaleUpperCase('tr-TR')}
            </span>
          </div>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 13,
              letterSpacing: 3,
              color: muted
            }}
          >
            {host}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 1040 }}>
          <span
            style={{
              fontSize: 78,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: -4,
              maxWidth: 1000
            }}
          >
            {content.hero.title}
          </span>
          <span
            style={{
              fontSize: 82,
              lineHeight: 1,
              letterSpacing: -3,
              color: accent,
              fontStyle: 'italic',
              maxWidth: 1000
            }}
          >
            {content.hero.titleAccent}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {content.hero.tags.slice(0, 4).map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              style={{
                fontSize: 14,
                letterSpacing: 2,
                padding: '8px 14px',
                borderRadius: 999,
                border: `1px solid ${muted}`,
                color: muted
              }}
            >
              {tag.toLocaleUpperCase('tr-TR')}
            </span>
          ))}
          <span
            style={{
              marginLeft: 'auto',
              width: 64,
              height: 64,
              borderRadius: 999,
              background: accent,
              color: accentInk,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28
            }}
          >
            ↗
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
