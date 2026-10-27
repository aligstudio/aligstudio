import type { MetadataRoute } from 'next';
import { getContent } from '@/lib/content';
import { SITE_URL, workSlug } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    {
      url: `${SITE_URL}/calismalar`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${SITE_URL}/hizmetler`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8
    }
  ];

  const items = content.works.items;
  const workRoutes: MetadataRoute.Sitemap = items.map((item, idx) => ({
    url: `${SITE_URL}/calismalar/${workSlug(item, idx, items)}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.6
  }));

  return [...staticRoutes, ...workRoutes];
}
