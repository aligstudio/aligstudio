import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/icons';
import { RevealObserver } from '@/components/RevealObserver';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { SmartLink } from '@/components/SmartLink';
import { getContent } from '@/lib/content';
import { initials, workSlug } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContent();
  const items = content.works.items;
  const item = items.find((work, idx) => workSlug(work, idx, items) === slug);
  if (!item) return { title: 'Çalışma bulunamadı' };
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: `/calismalar/${slug}` },
    openGraph: {
      title: `${item.title} — ${content.brand.name}`,
      description: item.description,
      images: item.image ? [{ url: item.image }] : undefined
    }
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const items = content.works.items;
  const labels = content.works.labels || {
    backToWorks: 'Çalışmalar',
    year: 'Yıl',
    category: 'Kategori',
    scope: 'Kapsam',
    liveLink: 'Bağlantı',
    visitProject: 'Projeyi gör',
    comingSoon: 'Vaka çalışması yakında.',
    similarPrompt: 'Benzer bir iş mi?',
    similarCta: 'Konuşalım',
    nextWork: 'Sıradaki çalışma'
  };

  const index = items.findIndex((work, idx) => workSlug(work, idx, items) === slug);
  if (index === -1) notFound();

  const item = items[index];
  const nextIndex = (index + 1) % items.length;
  const next = items.length > 1 ? items[nextIndex] : null;
  const nextSlug = next ? workSlug(next, nextIndex, items) : '';
  const external = item.url && /^https?:\/\//.test(item.url) ? item.url : '';
  const mono = initials(item.title || 'PR');

  return (
    <>
      <RevealObserver />
      <SiteHeader content={content} />
      <main id="main">
        <article>
          <header className="case-hero">
            <div className="container">
              <Link href="/calismalar" className="page-hero__back">
                <Icon name="chevronLeft" size={15} /> {labels.backToWorks || 'Çalışmalar'}
              </Link>
              <p className="eyebrow" data-reveal>
                <i aria-hidden="true" /> {item.category} — {item.year}
              </p>
              <h1 className="case-hero__title" data-reveal>
                {item.title}
              </h1>
              {item.tags.length > 0 ? (
                <div className="case-hero__sub" data-reveal>
                  {item.tags.map((tag, tagIdx) => (
                    <span className="chip" key={`${tag}-${tagIdx}`}>
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div
                className="case-hero__poster"
                data-reveal
                style={{ '--work-accent': item.accent } as CSSProperties}
              >
                {item.image ? (
                  <img src={item.image} alt={item.title} />
                ) : (
                  <div className="work-art">
                    <span className="work-art__grid" aria-hidden="true" />
                    <span className="work-art__watermark" aria-hidden="true">
                      {mono}
                    </span>
                    <span className="work-art__index">
                      CASE // {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="work-art__glyph" aria-hidden="true">
                      <Icon name="spark" size={84} strokeWidth={1.1} />
                    </span>
                    <span className="work-art__title">{item.title}</span>
                    <span className="work-art__meta">
                      {item.category} — {item.year}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="container">
            <div className="case-body">
              <div className="case-body__main">
                <p className="case-lead" data-reveal>
                  {item.description}
                </p>
                {item.details
                  ? item.details.split(/\n{2,}/).map((paragraph, pIdx) => (
                      <p key={`p-${pIdx}`} style={{ marginTop: 24 }} data-reveal>
                        {paragraph}
                      </p>
                    ))
                  : null}
              </div>

              <aside className="case-body__aside" data-reveal>
                <div className="case-aside-block">
                  <span>{labels.year}</span>
                  <p>{item.year}</p>
                </div>
                <div className="case-aside-block">
                  <span>{labels.category}</span>
                  <p>{item.category}</p>
                </div>
                <div className="case-aside-block">
                  <span>{labels.scope}</span>
                  <p>{item.tags.join(', ') || '—'}</p>
                </div>
                <div className="case-aside-block">
                  <span>{labels.liveLink}</span>
                  {external ? (
                    <a
                      href={external}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn--ghost btn--sm"
                    >
                      {labels.visitProject} <Icon name="external" size={14} />
                    </a>
                  ) : (
                    <p>{labels.comingSoon}</p>
                  )}
                </div>
                <div className="case-aside-block">
                  <span>{labels.similarPrompt}</span>
                  <SmartLink href="/#iletisim" className="btn btn--accent btn--sm">
                    {labels.similarCta} <Icon name="arrowUpRight" size={14} />
                  </SmartLink>
                </div>
              </aside>
            </div>
          </div>

          {next ? (
            <section className="case-next">
              <div className="container">
                <div className="case-next__head">
                  <span className="eyebrow">
                    <i aria-hidden="true" /> {labels.nextWork}
                  </span>
                  <Link href="/calismalar" className="link-arrow">
                    {content.works.filterAllLabel || 'Tümü'} <Icon name="arrowRight" size={15} />
                  </Link>
                </div>
                <Link href={`/calismalar/${nextSlug}`} className="case-next__link">
                  <h3>{next.title}</h3>
                  <span>
                    {next.category} — {next.year}
                  </span>
                  <Icon name="arrowUpRight" size={26} />
                </Link>
              </div>
            </section>
          ) : null}
        </article>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
