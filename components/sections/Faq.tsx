'use client';

import { useState, type CSSProperties } from 'react';
import type { SiteContent } from '@/lib/types';
import { SectionHead } from '../SectionHead';

export function Faq({ faq }: { faq: SiteContent['faq'] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faq || !Array.isArray(faq.items) || faq.items.length === 0) {
    return null;
  }

  return (
    <section className="section faq" id="sss">
      <div className="container">
        <SectionHead
          eyebrow={faq.eyebrow}
          title={faq.title}
          description={faq.description}
        />

        <div className="faq__list">
          {faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={`${item.question}-${index}`}
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
                data-reveal
                style={{ '--d': `${index * 60}ms` } as CSSProperties}
              >
                <button
                  type="button"
                  className="faq-item__trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="faq-item__num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="faq-item__question">{item.question}</span>
                  <span className="faq-item__icon" aria-hidden="true">
                    <span />
                    <span />
                  </span>
                </button>
                <div className="faq-item__panel" hidden={!isOpen}>
                  <p className="faq-item__answer">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
