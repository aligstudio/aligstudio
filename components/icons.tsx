import type { ReactNode } from 'react';

type IconProps = {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
};

const paths: Record<string, ReactNode> = {
  spark: (
    <>
      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07" />
      <circle cx="12" cy="12" r="2.4" />
    </>
  ),
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  arrowRight: <path d="M4 12h15M13 6l6 6-6 6" />,
  arrowUp: <path d="M12 20V4M5 11l7-7 7 7" />,
  arrowDown: <path d="M12 4v16M5 13l7 7 7-7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  menu: <path d="M3 7h18M3 17h18" />,
  check: <path d="m4 12 5 5L20 6" />,
  trash: (
    <>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  share: (
    <>
      <circle cx="18" cy="5" r="2.6" />
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="18" cy="19" r="2.6" />
      <path d="m8.3 10.7 7.4-4.3M8.3 13.3l7.4 4.3" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M7.5 4v16M16.5 4v16M3 9h4.5M3 15h4.5M16.5 9H21M16.5 15H21" />
    </>
  ),
  code: <path d="m8 6-6 6 6 6M16 6l6 6-6 6M13.5 4l-3 16" />,
  play: (
    <path
      d="M8.5 5.6v12.8c0 .8.9 1.3 1.6.9l10-6.4c.6-.4.6-1.4 0-1.8l-10-6.4c-.7-.4-1.6.1-1.6.9Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  pause: <path d="M8 5v14M16 5v14" />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  camera: (
    <>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.8l1.3-2h6.8l1.3 2h1.8A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-9Z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  phone: (
    <path d="M7.5 3.5h-2A2.5 2.5 0 0 0 3 6.2c.4 7.7 6.8 14.1 14.5 14.5a2.5 2.5 0 0 0 2.7-2.5v-2a1.5 1.5 0 0 0-1.2-1.5l-2.8-.6a1.5 1.5 0 0 0-1.5.7l-.8 1.2a13.6 13.6 0 0 1-5.9-5.9l1.2-.8a1.5 1.5 0 0 0 .7-1.5l-.6-2.8a1.5 1.5 0 0 0-1.5-1.2Z" />
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3.5" />
      <path d="M7.5 10v7M7.5 7.2v.1M11.5 17v-4a2.5 2.5 0 0 1 5 0v4" />
    </>
  ),
  x: <path d="M4 4l16 16M20 4 4 20" />,
  tiktok: (
    <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.6 2.2 2 3.6 4.5 3.8" />
  ),
  behance: (
    <text
      x="12"
      y="16.5"
      textAnchor="middle"
      fontSize="12"
      fontWeight="700"
      fontFamily="Arial, Helvetica, sans-serif"
      fill="currentColor"
      stroke="none"
    >
      Be
    </text>
  ),
  whatsapp: (
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  link: (
    <>
      <path d="M10 13.5a4 4 0 0 0 5.8.2l2.4-2.4a4 4 0 0 0-5.7-5.7L11 7" />
      <path d="M14 10.5a4 4 0 0 0-5.8-.2l-2.4 2.4a4 4 0 0 0 5.7 5.7L13 17" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6M20 4l-8 8" />
      <path d="M19 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 18.5v-13A1.5 1.5 0 0 1 4.5 4H9" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m4 17 5-5 4 4 2.5-2.5L20 18" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v12M7 11l5 5 5-5" />
      <path d="M4 20h16" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 15v2" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.8M6.3 6.8A16.5 16.5 0 0 0 2.5 12S6 18 12 18a9.7 9.7 0 0 0 3.4-.6" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5.5A1.5 1.5 0 0 1 4 19.5v-15A1.5 1.5 0 0 1 5.5 3H9" />
      <path d="M16 8l4 4-4 4M20 12H9" />
    </>
  ),
  monitor: (
    <>
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  layout: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M3 9h18M9 21V9" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.7-4 4-6 8-6s7.3 2 8 6" />
    </>
  ),
  quote: (
    <path d="M9.5 6C6.5 7.5 5 10 5 13v5h6v-6H8c0-2 .7-3.4 2.5-4.5L9.5 6Zm10 0C16.5 7.5 15 10 15 13v5h6v-6h-3c0-2 .7-3.4 2.5-4.5L19.5 6Z" />
  ),
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>
  )
};

export function Icon({ name, size = 20, className, strokeWidth = 1.6 }: IconProps) {
  const content = paths[name] ?? paths.link;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {content}
    </svg>
  );
}

export function socialIcon(platform: string): string {
  const map: Record<string, string> = {
    instagram: 'instagram',
    youtube: 'youtube',
    linkedin: 'linkedin',
    x: 'x',
    twitter: 'x',
    tiktok: 'tiktok',
    behance: 'behance',
    whatsapp: 'whatsapp',
    mail: 'mail',
    email: 'mail'
  };
  return map[platform.toLowerCase()] ?? 'link';
}
