import type { MetadataRoute } from 'next';
import { getContent } from '@/lib/content';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const content = await getContent();
  return {
    name: content.brand.name,
    short_name: content.brand.logoText,
    description: content.seo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#08090a',
    theme_color: '#08090a',
    icons: [{ src: '/icon', sizes: '64x64', type: 'image/png' }]
  };
}
