import type { CSSProperties } from 'react';
import type { ServiceItem, SiteContent } from '@/lib/types';
import { extractYouTubeId, slugify } from '@/lib/utils';
import { Icon } from '../icons';
import { SmartLink } from '../SmartLink';

export function Hero({
  hero,
  brand,
  services = []
}: {
  hero: SiteContent['hero'];
  brand: SiteContent['brand'];
  services?: ServiceItem[];
}) {
  const showcase = hero.showcase || {
    badge: 'STÜDYO VİTRİNİ • 04 DİSİPLİN',
    title: 'Strateji, prodüksiyon ve yazılım tek çatı altında.',
    subtitle: 'İçerik Sistemleri • Reklam Filmi • Dijital Ürün • YouTube',
    videoUrl: '',
    image: ''
  };

  const ytId = extractYouTubeId(showcase.videoUrl);
  const videoHref = ytId
    ? `https://www.youtube.com/watch?v=${ytId}`
    : showcase.videoUrl || '';

  const disciplines =
    services.length > 0
      ? services.slice(0, 4)
      : [
          {
            icon: 'share',
            title: 'Sosyal Medya Yönetimi',
            description: '',
            tags: ['Strateji', 'Reels']
          },
          {
            icon: 'film',
            title: 'Reklam & Prodüksiyon',
            description: '',
            tags: ['Çekim', 'Kurgu']
          },
          {
            icon: 'code',
            title: 'Yazılım & Teknoloji',
            description: '',
            tags: ['Web', 'AI']
          },
          {
            icon: 'play',
            title: 'YouTube İçerik Üretimi',
            description: '',
            tags: ['Format', 'Büyüme']
          }
        ];

  return (
    <section className="hero" id="hero">
      <div className="hero__grid-bg" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />

      <div className="container">
        <div className="hero__layout">
          <div className="hero__copy">
            <div className="hero__top-meta" data-reveal>
              <p className="eyebrow hero__eyebrow">
                <i aria-hidden="true" /> {hero.eyebrow}
              </p>
              {hero.availability ? (
                <span className="hero__status-pill">
                  <span className="status-dot" aria-hidden="true" />
                  {hero.availability}
                </span>
              ) : null}
            </div>

            <h1 className="hero__title">
              <span data-reveal>{hero.title}</span>
              <em data-reveal style={{ '--d': '80ms' } as CSSProperties}>
                {hero.titleAccent}
              </em>
            </h1>

            <p className="hero__desc" data-reveal style={{ '--d': '150ms' } as CSSProperties}>
              {hero.description}
            </p>

            <div className="hero__actions" data-reveal style={{ '--d': '220ms' } as CSSProperties}>
              <SmartLink href={hero.primaryCta.href} className="btn btn--accent btn--lg">
                {hero.primaryCta.label}
                <span className="btn__icon">
                  <Icon name="arrowUpRight" size={17} />
                </span>
              </SmartLink>
              <SmartLink href={hero.secondaryCta.href} className="btn btn--ghost btn--lg">
                {hero.secondaryCta.label}
              </SmartLink>
            </div>

            {hero.tags.length > 0 ? (
              <div className="hero__tags" data-reveal style={{ '--d': '290ms' } as CSSProperties}>
                {hero.tags.map((tag, index) => (
                  <span key={`${tag}-${index}`} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="hero__visual" data-reveal style={{ '--d': '200ms' } as CSSProperties}>
            <div className="hero-showcase">
              <div className="hero-showcase__bar">
                <span className="hero-showcase__badge">
                  <span className="status-dot" aria-hidden="true" />
                  {showcase.badge}
                </span>
                <span className="hero-showcase__code">{brand.logoText} // SYS</span>
              </div>

              {showcase.image || ytId ? (
                <div className="hero-showcase__media">
                  <img
                    src={
                      showcase.image || `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`
                    }
                    alt={showcase.title}
                  />
                  {videoHref ? (
                    <SmartLink
                      href={videoHref}
                      className="hero-showcase__play"
                      ariaLabel="Showreel izle"
                    >
                      <Icon name="play" size={20} />
                      <span>Showreel</span>
                    </SmartLink>
                  ) : null}
                </div>
              ) : null}

              <div className="hero-showcase__lead">
                <div className="hero-showcase__lead-copy">
                  <p className="hero-showcase__sub">{showcase.subtitle}</p>
                  <h2 className="hero-showcase__title">{showcase.title}</h2>
                </div>
                {videoHref && !showcase.image && !ytId ? (
                  <SmartLink href={videoHref} className="btn btn--accent btn--sm">
                    <Icon name="play" size={14} /> Showreel
                  </SmartLink>
                ) : (
                  <span className="hero-showcase__spark" aria-hidden="true">
                    <Icon name="spark" size={22} />
                  </span>
                )}
              </div>

              <div className="hero-showcase__bento">
                {disciplines.map((item, idx) => (
                  <SmartLink
                    key={`${item.title}-${idx}`}
                    href={`/hizmetler#${slugify(item.title)}`}
                    className="hero-bento-card"
                  >
                    <div className="hero-bento-card__top">
                      <span className="hero-bento-card__icon">
                        <Icon name={item.icon} size={18} />
                      </span>
                      <span className="hero-bento-card__num">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <strong className="hero-bento-card__title">{item.title}</strong>
                    <div className="hero-bento-card__tags">
                      {item.tags.slice(0, 2).map((tag, tIdx) => (
                        <span key={`${tag}-${tIdx}`}>{tag}</span>
                      ))}
                    </div>
                  </SmartLink>
                ))}
              </div>
            </div>
          </div>
        </div>

        {hero.stats.length > 0 ? (
          <div className="hero__stats" data-reveal style={{ '--d': '320ms' } as CSSProperties}>
            {hero.stats.map((stat, index) => (
              <div className="hero-stat" key={`${stat.value}-${stat.label}-${index}`}>
                <span className="hero-stat__value">{stat.value}</span>
                <span className="hero-stat__label">{stat.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
