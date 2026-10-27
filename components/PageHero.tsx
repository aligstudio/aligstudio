import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from './icons';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  back?: { label: string; href: string };
  accentWord?: string;
};

export function PageHero({ eyebrow, title, description, meta, back, accentWord }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="container">
        {back ? (
          <Link href={back.href} className="page-hero__back">
            <Icon name="chevronLeft" size={15} /> {back.label}
          </Link>
        ) : null}
        <p className="eyebrow" data-reveal>
          <i /> {eyebrow}
        </p>
        <h1 className="page-hero__title" data-reveal>
          {title}
          {accentWord ? <em>{accentWord}</em> : null}
        </h1>
        <div className="page-hero__foot" data-reveal>
          {description ? <p>{description}</p> : null}
          {meta ? <div className="page-hero__meta">{meta}</div> : null}
        </div>
      </div>
    </section>
  );
}
