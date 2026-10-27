'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { SiteContent } from '@/lib/types';
import { safeHref } from '@/lib/utils';
import { Icon } from './icons';

export function SiteHeaderClient({ content }: { content: SiteContent }) {
  const { brand, nav, contact, header } = content;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href.startsWith('/') &&
    !href.includes('#') &&
    (pathname === href || (href !== '/' && pathname.startsWith(`${href}/`)));

  const brandSub = brand.tagline || brand.name.replace(brand.logoText, '').trim();
  const ctaHref = safeHref(header?.ctaHref, '/#iletisim');

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
        <div className="container site-header__inner">
          <Link href="/" className="brand" aria-label={`${brand.name} ana sayfa`}>
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

          <nav className="site-nav" aria-label="Ana menü">
            {nav.map((item, index) => {
              const href = safeHref(item.href, '/');
              return (
                <Link
                  key={`${item.label}-${href}-${index}`}
                  href={href}
                  className={isActive(href) ? 'is-active' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="site-header__actions">
            <Link href={ctaHref} className="btn btn--accent btn--sm header-cta">
              {header?.ctaLabel || 'Başlayalım'} <Icon name="arrowUpRight" size={15} />
            </Link>
            <button
              type="button"
              className="menu-toggle"
              aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="mobile-menu__inner">
          <p className="eyebrow">
            <i aria-hidden="true" /> {header?.mobileTitle || 'Menü'}
          </p>
          <nav aria-label="Mobil menü">
            {nav.map((item, index) => {
              const href = safeHref(item.href, '/');
              return (
                <Link
                  key={`${item.label}-${href}-${index}`}
                  href={href}
                  onClick={() => setOpen(false)}
                >
                  <span className="mobile-menu__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                  <Icon name="arrowUpRight" size={20} />
                </Link>
              );
            })}
          </nav>
          <div className="mobile-menu__foot">
            <Link
              href={ctaHref}
              className="btn btn--accent btn--lg mobile-menu__cta"
              onClick={() => setOpen(false)}
            >
              {header?.mobileCtaLabel || 'Projeni anlat'} <Icon name="arrowUpRight" size={16} />
            </Link>
            <a href={safeHref(`mailto:${contact.email}`, '#')} className="mobile-menu__mail">
              {contact.email}
            </a>
            <p>{contact.location}</p>
          </div>
        </div>
      </div>
    </>
  );
}
