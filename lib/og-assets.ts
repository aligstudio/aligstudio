import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Server-only helpers for embedding brand images into ImageResponse-based
 * routes (favicon, opengraph-image). satori cannot resolve root-relative
 * paths, so local files under /public are converted to data URIs.
 */
export async function resolveImageSrc(logoImage: string): Promise<string | null> {
  if (!logoImage) return null;
  if (logoImage.startsWith('https://') || logoImage.startsWith('http://')) {
    return logoImage;
  }
  if (logoImage.startsWith('/') && !logoImage.startsWith('//')) {
    try {
      const filePath = path.join(process.cwd(), 'public', logoImage.replace(/^\/+/, ''));
      const bytes = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
      return `data:${mime};base64,${bytes.toString('base64')}`;
    } catch {
      return null;
    }
  }
  return null;
}
