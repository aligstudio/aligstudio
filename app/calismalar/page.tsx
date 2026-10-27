import type { Metadata } from 'next';
import { Icon } from '@/components/icons';
import { PageHero } from '@/components/PageHero';
import { RevealObserver } from '@/components/RevealObserver';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { SmartLink } from '@/components/SmartLink';
import { WorksExplorer } from '@/components/WorksExplorer';
import { getContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    title: content.works.allLinkLabel || 'Çalışmalar',
    description: content.works.description,
    alternates: { canonical: '/calismalar' }
  };
}

export default async function WorksPage() {
  const content = await getContent();
  const count = content.works.items.length;
  const years = content.works.items
    .map((item) => Number(item.year))
    .filter((year) => Number.isFinite(year));
  const range = years.length
    ? Math.min(...years) === Math.max(...years)
      ? `${Math.min(...years)}`
      : `${Math.min(...years)} — ${Math.max(...years)}`
    : 'Seçki';

  return (
    <>
      <RevealObserver />
      <SiteHeader content={content} />
      <main id="main" className="works-page">
        <PageHero
          eyebrow={content.works.eyebrow}
          title={content.works.title}
          description={content.works.description}
          meta={
            <>
              <span>{count} proje</span>
              <span>{range}</span>
            </>
          }
        />

        <section className="page-list">
          <div className="container">
            <WorksExplorer
              items={content.works.items}
              filterAllLabel={content.works.filterAllLabel}
            />

            <div className="services-note" data-reveal>
              <p>
                {content.works.calloutText ||
                  'Senin işin de burada olabilir. Kısa bir brief yeter; gerisini birlikte kurgularız.'}
              </p>
              <SmartLink
                href={content.works.calloutCtaHref || '/#iletisim'}
                className="btn btn--accent"
              >
                {content.works.calloutCtaLabel || 'Projeni anlat'}{' '}
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
