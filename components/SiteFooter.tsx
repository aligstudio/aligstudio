import Link from 'next/link';
import type { SiteContent } from '@/lib/types';
import { safeHref } from '@/lib/utils';
import { Icon, socialIcon } from './icons';

export function SiteFooter({ content }: { content: SiteContent }) {
  const { brand, footer, nav, contact, social } = content;
  const brandSub = brand.tagline || brand.name.replace(brand.logoText, '').trim();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Link href="/" className="brand brand--footer" aria-label={`${brand.name} ana sayfa`}>
              {brand.logoImage ? (
                <img src={brand.logoImage} alt={brand.name} className="brand__image" />
              ) : (
                <>
                  <span className="brand__mark" aria-hidden="true">
                    <Icon name="spark" size={17} strokeWidth={1.9} />
                  </span>
                  <span className="brand__word">
                    <strong>{brand.logoText}</strong>
                    {brandSub ? <small>{brandSub}</small> : null}
                  </span>
                </>
              )}
            </Link>
            <p className="site-footer__note">{footer.note}</p>
            <a href={safeHref(`mailto:${contact.email}`, '#')} className="site-footer__mail">
              {contact.email}
              <Icon name="arrowUpRight" size={15} />
            </a>
          </div>

          <div className="site-footer__col">
            <span className="site-footer__label">{footer.menuTitle || 'Menü'}</span>
            <nav aria-label="Alt menü">
              {nav.map((item, index) => {
                const href = safeHref(item.href, '/');
                return (
                  <Link key={`${item.label}-${href}-${index}`} href={href}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="site-footer__col">
            <span className="site-footer__label">{footer.studioTitle || 'Stüdyo'}</span>
            <p>{contact.location}</p>
            {contact.phone ? (
              <a href={safeHref(`tel:${contact.phone.replace(/\s/g, '')}`, '#')}>
                {contact.phone}
              </a>
            ) : null}
            {contact.whatsapp ? (
              <p>
                <a href={safeHref(contact.whatsapp, '#')} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </p>
            ) : null}
            <p>
              <Link href="/hizmetler">{content.services.allLinkLabel || 'Hizmetler'}</Link>
            </p>
          </div>

          <div className="site-footer__col">
            <span className="site-footer__label">{footer.socialTitle || 'Sosyal'}</span>
            <div className="site-footer__socials">
              {social
                .filter((item) => item.url)
                .map((item) => (
                  <a
                    key={`${item.platform}-${item.url}`}
                    href={safeHref(item.url, '#')}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.platform}
                    title={item.platform}
                  >
                    <Icon name={socialIcon(item.platform)} size={16} />
                  </a>
                ))}
            </div>
            <a href="#top" className="site-footer__top-link">
              {footer.backToTopLabel || 'Yukarı çık'} <Icon name="arrowUp" size={14} />
            </a>
          </div>
        </div>

        <div className="site-footer__wordmark" aria-hidden="true">
          {brand.logoText}
        </div>

        <div className="site-footer__bottom">
          <p>{footer.copyright}</p>
          <p className="site-footer__legal">
            <Link href="/kvkk">KVKK Aydınlatma Metni</Link>
            <Link href="/gizlilik">Gizlilik &amp; Çerez Politikası</Link>
          </p>
          {footer.statusText ? (
            <p className="site-footer__made">
              <span className="status-dot" /> {footer.statusText}
            </p>
          ) : null}
          <p>
            {footer.signatureText || 'Tasarım & kod'}{' '}
            <span className="site-footer__sig">{brand.logoText}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
