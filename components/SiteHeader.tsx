import type { SiteContent } from '@/lib/types';
import { SiteHeaderClient } from './SiteHeaderClient';

export function SiteHeader({ content }: { content: SiteContent }) {
  return <SiteHeaderClient content={content} />;
}
