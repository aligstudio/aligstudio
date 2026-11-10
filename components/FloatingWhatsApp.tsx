'use client';

import { usePathname } from 'next/navigation';
import { Icon } from './icons';

/**
 * Floating WhatsApp shortcut (bottom-right). Renders only when a WhatsApp
 * link is configured in content > contact. Hidden on admin pages.
 */
export function FloatingWhatsApp({ href }: { href?: string }) {
  const pathname = usePathname();
  const safe = href && /^https?:\/\//i.test(href) ? href : null;
  if (!safe || pathname.startsWith('/admin')) return null;

  return (
    <a
      href={safe}
      className="wa-float"
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp ile yaz"
      title="WhatsApp ile yaz"
    >
      <Icon name="whatsapp" size={26} />
    </a>
  );
}
