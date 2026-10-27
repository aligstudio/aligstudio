import type { SiteContent } from '@/lib/types';
import { Icon } from '../icons';
import { SectionHead } from '../SectionHead';
import { SmartLink } from '../SmartLink';
import { WorksExplorer } from '../WorksExplorer';

export function Works({ works }: { works: SiteContent['works'] }) {
  return (
    <section className="section works" id="calismalar">
      <div className="container">
        <SectionHead
          eyebrow={works.eyebrow}
          title={works.title}
          description={works.description}
          action={
            <SmartLink href="/calismalar" className="link-arrow">
              {works.allLinkLabel || 'Tüm çalışmalar'} <Icon name="arrowRight" size={16} />
            </SmartLink>
          }
        />

        <WorksExplorer
          items={works.items}
          filterAllLabel={works.filterAllLabel}
          limit={4}
        />
      </div>
    </section>
  );
}
