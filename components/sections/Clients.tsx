import type { CSSProperties } from 'react';
import type { SiteContent } from '@/lib/types';
import { Icon } from '../icons';
import { SmartLink } from '../SmartLink';

export function Clients({ clients }: { clients: SiteContent['clients'] }) {
  if (!clients || !Array.isArray(clients.items) || clients.items.length === 0) {
    return null;
  }

  return (
    <section className="clients-section" aria-label={clients.eyebrow}>
      <div className="container">
        <div className="clients-bar" data-reveal>
          <p className="eyebrow clients-bar__eyebrow">
            <i aria-hidden="true" /> {clients.eyebrow}
          </p>
          <div className="clients-bar__grid">
            {clients.items.map((item, index) => {
              const inner = (
                <>
                  <span className="client-pill__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="client-pill__body">
                    <strong>{item.name}</strong>
                    {item.category ? <small>{item.category}</small> : null}
                  </span>
                  {item.url ? <Icon name="arrowUpRight" size={14} /> : null}
                </>
              );

              return item.url ? (
                <SmartLink
                  key={`${item.name}-${index}`}
                  href={item.url}
                  className="client-pill client-pill--link"
                >
                  {inner}
                </SmartLink>
              ) : (
                <div
                  key={`${item.name}-${index}`}
                  className="client-pill"
                  style={{ '--d': `${index * 45}ms` } as CSSProperties}
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
