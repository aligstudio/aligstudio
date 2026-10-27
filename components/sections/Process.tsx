import type { CSSProperties } from 'react';
import type { SiteContent } from '@/lib/types';
import { SectionHead } from '../SectionHead';

export function Process({ process }: { process: SiteContent['process'] }) {
  return (
    <section className="section process">
      <div className="container">
        <SectionHead
          eyebrow={process.eyebrow}
          title={process.title}
          description={process.description}
        />

        <ol className="process__grid">
          {process.items.map((step, index) => (
            <li
              className="process-step"
              key={`${step.title}-${index}`}
              data-reveal
              style={{ '--d': `${index * 80}ms` } as CSSProperties}
            >
              <span className="process-step__index">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
