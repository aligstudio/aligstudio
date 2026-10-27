import type { Metadata } from 'next';
import { Icon } from '@/components/icons';
import { PageHero } from '@/components/PageHero';
import { RevealObserver } from '@/components/RevealObserver';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { SmartLink } from '@/components/SmartLink';
import { getContent } from '@/lib/content';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    title: content.services.allLinkLabel || 'Hizmetler',
    description: content.services.description,
    alternates: { canonical: '/hizmetler' }
  };
}

export default async function ServicesPage() {
  const content = await getContent();

  return (
    <>
      <RevealObserver />
      <SiteHeader content={content} />
      <main id="main">
        <PageHero
          eyebrow={content.services.eyebrow}
          title={content.services.title}
          description={content.services.description}
          meta={
            <>
              <span>{content.services.items.length} disiplin</span>
              <span>Strateji + üretim</span>
              <span>Tek ekip</span>
            </>
          }
        />

        <section className="page-list">
          <div className="container">
            <div className="service-index">
              {content.services.items.map((service, index) => (
                <article
                  className="service-row"
                  key={`${service.title}-${index}`}
                  id={slugify(service.title)}
                  data-reveal
                >
                  <span className="service-row__num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h2 className="service-row__title">
                    <Icon name={service.icon} size={22} />
                    {service.title}
                  </h2>
                  <p>{service.description}</p>
                  <div className="service-row__tags">
                    {service.tags.map((tag, tagIdx) => (
                      <span key={`${tag}-${tagIdx}`}>{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="services-note" data-reveal>
              <p>
                {content.services.calloutText ||
                  'Tek bir hizmete ihtiyacın olsa da hepsini aynı çatı altında kurgulayabiliriz. Kapsamı birlikte netleştirelim.'}
              </p>
              <SmartLink
                href={content.services.calloutCtaHref || '/#iletisim'}
                className="btn btn--accent"
              >
                {content.services.calloutCtaLabel || 'Brief paylaş'}{' '}
                <Icon name="arrowUpRight" size={16} />
              </SmartLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
