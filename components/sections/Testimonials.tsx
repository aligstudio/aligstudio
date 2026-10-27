import type { CSSProperties } from 'react';
import type { SiteContent } from '@/lib/types';
import { initials } from '@/lib/utils';
import { Icon } from '../icons';
import { SectionHead } from '../SectionHead';

export function Testimonials({ testimonials }: { testimonials: SiteContent['testimonials'] }) {
  return (
    <section className="section testimonials">
      <div className="container">
        <SectionHead eyebrow={testimonials.eyebrow} title={testimonials.title} />

        <div className="testimonials__grid">
          {testimonials.items.map((item, index) => (
            <figure
              className="testimonial"
              key={`${item.name}-${index}`}
              data-reveal
              style={{ '--d': `${index * 80}ms` } as CSSProperties}
            >
              <span className="testimonial__quote" aria-hidden="true">
                <Icon name="quote" size={26} />
              </span>
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <span className="testimonial__avatar">{initials(item.name)}</span>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.role}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
