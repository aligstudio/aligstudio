'use client';

import { useMemo, useState } from 'react';
import type { WorkItem } from '@/lib/types';
import { WorkCard } from './WorkCard';

export function WorksExplorer({
  items,
  filterAllLabel = 'Tümü',
  limit
}: {
  items: WorkItem[];
  filterAllLabel?: string;
  limit?: number;
}) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      const cat = (item.category || '').trim();
      if (!cat) continue;
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
  }, [items]);

  const indexedItems = useMemo(() => {
    const withIndex = items.map((item, originalIndex) => ({ item, originalIndex }));
    const filtered =
      activeCategory === 'ALL'
        ? withIndex
        : withIndex.filter(({ item }) => (item.category || '').trim() === activeCategory);
    return typeof limit === 'number' && activeCategory === 'ALL'
      ? filtered.slice(0, limit)
      : filtered;
  }, [items, activeCategory, limit]);

  return (
    <div className="works-explorer">
      {categories.length > 1 && items.length >= 4 ? (
        <div className="works-filter" role="tablist" aria-label="Kategori filtresi">
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'ALL'}
            className={`works-filter__btn ${activeCategory === 'ALL' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('ALL')}
          >
            <span>{filterAllLabel || 'Tümü'}</span>
            <small>{items.length}</small>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.name}
              className={`works-filter__btn ${activeCategory === cat.name ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              <span>{cat.name}</span>
              <small>{cat.count}</small>
            </button>
          ))}
        </div>
      ) : null}

      <div className="works__grid">
        {indexedItems.map(({ item, originalIndex }, displayIdx) => (
          <WorkCard
            item={item}
            index={originalIndex}
            allItems={items}
            size={displayIdx % 3 === 1 ? 'tall' : 'default'}
            key={`${item.title}-${originalIndex}`}
          />
        ))}
      </div>
    </div>
  );
}
