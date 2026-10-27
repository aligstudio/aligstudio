import { ImageResponse } from 'next/og';
import { getContent } from '@/lib/content';
import { resolveImageSrc } from '@/lib/og-assets';

export const runtime = 'nodejs';
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default async function Icon() {
  const content = await getContent();
  const accent = content.brand.accent;
  const bg = content.brand.bg || '#08090a';
  const logoSrc = await resolveImageSrc(content.brand.logoImage);

  if (logoSrc) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: bg,
            borderRadius: 32,
            overflow: 'hidden',
            border: '1.5px solid rgba(255,255,255,0.16)'
          }}
        >
          <img
            src={logoSrc}
            alt=""
            style={{ width: '96%', height: '96%', objectFit: 'contain' }}
          />
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: bg,
          color: accent,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: -1,
          border: `2px solid ${accent}`,
          borderRadius: 18
        }}
      >
        {content.brand.logoText.slice(0, 2).toUpperCase()}
      </div>
    ),
    { ...size }
  );
}
