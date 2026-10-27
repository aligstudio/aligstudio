import type { CSSProperties } from 'react';
import type { SiteContent } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { Icon } from '../icons';
import { SectionHead } from '../SectionHead';
import { SmartLink } from '../SmartLink';

export function Services({ services }: { services: SiteContent['services'] }) {
  return (
    <section className="section services" id="hizmetler">
      <div className="container">
        <SectionHead
          eyebrow={services.eyebrow}
          title={services.title}
          description={services.description}
          action={
            <SmartLink href="/hizmetler" className="link-arrow">
              {services.allLinkLabel || 'Tüm hizmetler'} <Icon name="arrowRight" size={16} />
            </SmartLink>
          }
        />

        <div className="services__grid">
          {services.items.map((service, index) => (
            <SmartLink
              key={`${service.title}-${index}`}
              href={`/hizmetler#${slugify(service.title)}`}
              className="service-card"
            >
              <span
                className="service-card__inner"
                data-reveal
                style={{ '--d': `${index * 70}ms` } as CSSProperties}
              >
                <span className="service-card__top">
                  <span className="service-card__icon">
                    <Icon name={service.icon} size={22} />
                  </span>
                  <span className="service-card__num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </span>
                <span className="service-card__body">
                  <h3 className="service-card__title">{service.title}</h3>
                  <span className="service-card__desc">{service.description}</span>
                </span>
                <span className="service-card__bottom">
                  <span className="service-card__tags">
                    {service.tags.map((tag, tagIdx) => (
                      <span key={`${tag}-${tagIdx}`}>{tag}</span>
                    ))}
                  </span>
                  <span className="service-card__arrow">
                    <Icon name="arrowUpRight" size={18} />
                  </span>
                </span>
              </span>
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
}
