import { Icon } from './icons';

/**
 * Floating WhatsApp shortcut (bottom-right). Renders only when a WhatsApp
 * link is configured in content > contact.
 */
export function FloatingWhatsApp({ href }: { href?: string }) {
  const safe = href && /^https?:\/\//i.test(href) ? href : null;
  if (!safe) return null;

  return (
    <a
      href={safe}
      className="wa-float"
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp ile yaz"
      title="WhatsApp ile yaz"
    >
      <Icon name="whatsapp" size={23} />
    </a>
  );
}
