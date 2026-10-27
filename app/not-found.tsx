import Link from 'next/link';
import { Icon } from '@/components/icons';
import { getContent } from '@/lib/content';

export default async function NotFound() {
  const content = await getContent();
  const nf = content.notFound;

  return (
    <main id="main" className="not-found">
      <div className="container">
        <p className="not-found__code">{nf?.code || '404 / SAYFA BULUNAMADI'}</p>
        <h1>{nf?.title || 'Burada bir şey yok. Ama iyi işler başka yerde.'}</h1>
        <p>
          {nf?.description ||
            'Aradığın sayfa taşınmış veya hiç var olmamış olabilir. Stüdyoya dönüp çalışmalara göz atabilirsin.'}
        </p>
        <Link href="/" className="btn btn--accent">
          {nf?.ctaLabel || 'Ana sayfaya dön'} <Icon name="arrowRight" size={16} />
        </Link>
      </div>
    </main>
  );
}
