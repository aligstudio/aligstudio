import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { WorkItem } from '@/lib/types';
import { initials, workSlug } from '@/lib/utils';
import { Icon } from './icons';

type WorkCardProps = {
  item: WorkItem;
  index: number;
  allItems?: ReadonlyArray<WorkItem>;
  size?: 'default' | 'tall';
};

export function WorkCard({ item, index, allItems, size = 'default' }: WorkCardProps) {
  const style = {
    '--work-accent': item.accent,
    '--d': `${Math.min(index, 6) * 55}ms`
  } as CSSProperties;

  const slug = workSlug(item, index, allItems);
  const mono = initials(item.title || 'PR');

  return (
    <Link
      href={`/calismalar/${slug}`}
      className={`work-card ${size === 'tall' ? 'work-card--tall' : ''}`}
      style={style}
      data-reveal
    >
      <div className="work-card__poster">
        {item.image ? (
          <>
            <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
            <span className="work-card__shade" />
          </>
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
              <Icon name="spark" size={56} strokeWidth={1.1} />
            </span>
            <span className="work-art__title">{item.title}</span>
            <span className="work-art__meta">
              {item.category} • {item.year}
            </span>
          </div>
        )}
        <span className="work-card__arrow">
          <Icon name="arrowUpRight" size={18} />
        </span>
        <span className="work-card__badge">
          {item.year} <i aria-hidden="true" /> {item.category}
        </span>
      </div>

      <div className="work-card__body">
        <div className="work-card__row">
          <h3>{item.title}</h3>
          <span className="work-card__year">{item.year}</span>
        </div>
        <p className="work-card__desc">{item.description}</p>
        <div className="work-card__tags">
          {item.tags.slice(0, 4).map((tag, tagIdx) => (
            <span key={`${tag}-${tagIdx}`}>{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
