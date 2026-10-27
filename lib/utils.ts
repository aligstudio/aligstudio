function resolveSiteUrl(raw: string | undefined): string {
  const fallback = 'https://www.aligstudio.com';
  if (!raw || !raw.trim()) return fallback;
  const trimmed = raw.trim().replace(/\/+$/, '');
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.origin;
    }
  } catch {
    // Fallback to default URL if environment variable is malformed
  }
  return fallback;
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Deep-merges stored content onto the defaults so older saves never break the site. */
export function deepMerge<T>(base: T, patch: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(patch) ? patch : base) as T;
  }
  if (isPlainObject(base)) {
    if (!isPlainObject(patch)) return base;
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(patch)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
      out[key] = key in base ? deepMerge((base as Record<string, unknown>)[key], patch[key]) : patch[key];
    }
    return out as T;
  }
  return (patch === undefined || patch === null ? base : patch) as T;
}

export function clampText(value: unknown, fallback = '', max = 4000): string {
  return typeof value === 'string' ? value.slice(0, max) : fallback;
}

export function normalizeHex(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const v = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v.toUpperCase();
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`.toUpperCase();
  }
  return fallback;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n)) return { r: 198, g: 242, b: 78 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** Black or white text, whichever is readable on the given background. */
export function contrastInk(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? '#0a0b08' : '#f7f7f2';
}

const UNSAFE_PROTOCOL = /^\s*(?:javascript|data|vbscript|file):/i;

/**
 * Allows only http(s), mailto, tel, hash and root-relative links.
 * Everything else (including javascript:/data:) falls back safely.
 */
export function safeHref(value: unknown, fallback = '#'): string {
  if (typeof value !== 'string') return fallback;
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  if (!cleaned || UNSAFE_PROTOCOL.test(cleaned)) return fallback;
  if (cleaned.startsWith('#')) return cleaned;
  if (cleaned.startsWith('/') && !cleaned.startsWith('//')) return cleaned;

  try {
    const url = new URL(cleaned);
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)) {
      return url.toString();
    }
  } catch {
    return fallback;
  }
  return fallback;
}

/**
 * Allows only http(s) and root-relative paths for images.
 */
export function safeImageSrc(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') return fallback;
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  if (!cleaned || UNSAFE_PROTOCOL.test(cleaned)) return fallback;
  if (cleaned.startsWith('/') && !cleaned.startsWith('//')) return cleaned;

  try {
    const url = new URL(cleaned);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString();
    }
  } catch {
    return fallback;
  }
  return fallback;
}

/**
 * Extracts a valid 11-character YouTube video ID from either a raw ID or a full YouTube URL.
 */
export function extractYouTubeId(value: unknown): string {
  if (typeof value !== 'string') return '';
  const cleaned = value.trim();
  if (!cleaned) return '';
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleaned)) return cleaned;

  try {
    const withProtocol = /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
    const url = new URL(withProtocol);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0] || '';
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : '';
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const v = url.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

      const parts = url.pathname.split('/').filter(Boolean);
      if (
        parts.length >= 2 &&
        ['shorts', 'embed', 'live', 'v'].includes(parts[0]) &&
        /^[a-zA-Z0-9_-]{11}$/.test(parts[1])
      ) {
        return parts[1];
      }
    }
  } catch {
    return '';
  }

  return '';
}

/** Safely embeds JSON into a <script> tag without allowing </script> breakout. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function slugify(value: string): string {
  const slug = value
    .toLocaleLowerCase('tr-TR')
    .replace(/i̇/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return slug || 'oge';
}

export function workSlug(
  item: { title: string },
  index: number,
  allItems?: ReadonlyArray<{ title: string }>
): string {
  const base = slugify(item.title || `proje-${index + 1}`);
  if (!allItems) return base;
  let duplicateOrder = 0;
  for (let i = 0; i <= index && i < allItems.length; i += 1) {
    if (slugify(allItems[i].title || `proje-${i + 1}`) === base) {
      duplicateOrder += 1;
    }
  }
  return duplicateOrder > 1 ? `${base}-${duplicateOrder}` : base;
}

export function initials(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase('tr-TR') ?? '')
    .join('');
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
