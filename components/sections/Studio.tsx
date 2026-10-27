import type { SiteContent } from '@/lib/types';
import { Icon } from '../icons';
import { SmartLink } from '../SmartLink';

export function Studio({
  about,
  brand
}: {
  about: SiteContent['about'];
  brand: SiteContent['brand'];
}) {
  return (
    <section className="section studio" id="studyo">
      <div className="container">
        <div className="studio__layout">
          <div className="studio__visual" data-reveal>
            {about.image ? (
              <img src={about.image} alt={brand.name} className="studio__image" loading="lazy" />
            ) : (
              <div className="studio-art">
                <span className="studio-art__grid" aria-hidden="true" />
                <span className="studio-art__tag">
                  {about.badgeTop || 'STUDIO / ISTANBUL'}
                </span>
                <span className="studio-art__big" aria-hidden="true">
                  {brand.logoText}
                </span>
                <span className="studio-art__ring" aria-hidden="true" />
                <span className="studio-art__spark" aria-hidden="true">
                  <Icon name="spark" size={30} strokeWidth={1.2} />
                </span>
                <span className="studio-art__caption">
                  {about.badgeBottom || 'İçerik • Prodüksiyon • Yazılım'}
                </span>
              </div>
            )}
          </div>

          <div className="studio__copy">
            <p className="eyebrow" data-reveal>
              <i aria-hidden="true" /> {about.eyebrow}
            </p>
            <h2 className="studio__title" data-reveal>
              {about.title}
            </h2>
            <p className="studio__desc" data-reveal>
              {about.description}
            </p>

            <ul className="check-list" data-reveal>
              {about.points.map((point, index) => (
                <li key={`${point}-${index}`}>
                  <span className="check-list__icon">
                    <Icon name="check" size={13} strokeWidth={2.2} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            {about.ctaLabel ? (
              <SmartLink href={about.ctaHref || '/hizmetler'} className="btn btn--ghost">
                {about.ctaLabel} <Icon name="arrowRight" size={16} />
              </SmartLink>
            ) : null}
          </div>
        </div>

        {about.stats.length > 0 ? (
          <div className="studio__stats" data-reveal>
            {about.stats.map((stat, index) => (
              <div className="studio-stat" key={`${stat.value}-${stat.label}-${index}`}>
                <span className="studio-stat__value">{stat.value}</span>
                <span className="studio-stat__label">{stat.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
