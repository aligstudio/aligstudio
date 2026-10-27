import type { Metadata, Viewport } from 'next';
import {
  Instrument_Serif,
  Inter,
  JetBrains_Mono,
  Space_Grotesk
} from 'next/font/google';
import type { CSSProperties } from 'react';
import { CookieConsent } from '@/components/CookieConsent';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { getContent } from '@/lib/content';
import { contrastInk, hexToRgb, serializeJsonLd, SITE_URL } from '@/lib/utils';
import './globals.css';

const fontDisplay = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap'
});

const fontBody = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap'
});

const fontSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap'
});

const fontMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap'
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  const { seo, brand } = content;
  const title = seo.title || `${brand.name} — Yaratıcı Teknoloji Stüdyosu`;
  const description = seo.description || '';
  const keywords = seo.keywords
    .split(',')
    .map((word) => word.trim())
    .filter(Boolean);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s — ${brand.name}`
    },
    description,
    keywords,
    applicationName: brand.name,
    authors: [{ name: brand.name, url: SITE_URL }],
    creator: brand.name,
    publisher: brand.name,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      url: SITE_URL,
      siteName: brand.name,
      title,
      description,
      images: seo.ogImage
        ? [{ url: seo.ogImage }]
        : [{ url: '/opengraph-image', width: 1200, height: 630, alt: brand.name }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: seo.ogImage ? [seo.ogImage] : ['/opengraph-image']
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon', type: 'image/png' }
      ],
      shortcut: ['/favicon.ico'],
      apple: ['/icon']
    },
    manifest: '/manifest.webmanifest',
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' }
    }
  };
}

export async function generateViewport(): Promise<Viewport> {
  const content = await getContent();
  const bg = content.brand.bg || '#08090A';
  const bgRgb = hexToRgb(bg);
  const isLight = (bgRgb.r * 299 + bgRgb.g * 587 + bgRgb.b * 114) / 1000 >= 140;

  return {
    themeColor: bg,
    colorScheme: isLight ? 'light' : 'dark',
    width: 'device-width',
    initialScale: 1
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  const { bg, bgElevated, ink, muted, accent, accentSoft } = content.brand;

  const bgRgb = hexToRgb(bg);
  const inkRgb = hexToRgb(ink);
  const accentRgb = hexToRgb(accent);
  const isLight = (bgRgb.r * 299 + bgRgb.g * 587 + bgRgb.b * 114) / 1000 >= 140;

  const style = {
    '--bg': bg,
    '--bg-elev': bgElevated,
    '--bg-rgb': `${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}`,
    '--ink': ink,
    '--ink-soft': `color-mix(in srgb, ${ink} 86%, ${bg})`,
    '--ink-rgb': `${inkRgb.r}, ${inkRgb.g}, ${inkRgb.b}`,
    '--muted': muted,
    '--muted-2': `color-mix(in srgb, ${muted} 76%, ${bg})`,
    '--line': `rgba(${inkRgb.r}, ${inkRgb.g}, ${inkRgb.b}, ${isLight ? '0.11' : '0.09'})`,
    '--line-strong': `rgba(${inkRgb.r}, ${inkRgb.g}, ${inkRgb.b}, ${isLight ? '0.22' : '0.18'})`,
    '--surface': `rgba(${inkRgb.r}, ${inkRgb.g}, ${inkRgb.b}, ${isLight ? '0.035' : '0.022'})`,
    '--surface-hover': `rgba(${inkRgb.r}, ${inkRgb.g}, ${inkRgb.b}, ${isLight ? '0.06' : '0.04'})`,
    '--glass-bg': `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, 0.78)`,
    '--accent': accent,
    '--accent-soft': accentSoft,
    '--accent-ink': contrastInk(accent),
    '--accent-rgb': `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`
  } as CSSProperties;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#studio`,
      name: content.brand.name,
      url: SITE_URL,
      email: content.contact.email,
      description: content.seo.description,
      logo: content.brand.logoImage
        ? content.brand.logoImage.startsWith('/')
          ? `${SITE_URL}${content.brand.logoImage}`
          : content.brand.logoImage
        : `${SITE_URL}/icon`,
      sameAs: content.social.map((item) => item.url).filter(Boolean),
      address: {
        '@type': 'PostalAddress',
        addressLocality: content.contact.location
      }
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: content.brand.name,
      inLanguage: 'tr-TR',
      publisher: { '@id': `${SITE_URL}/#studio` }
    }
  ];

  if (content.sections.showFaq && content.faq.items.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: content.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    });
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': graph
  };

  const fontClasses = [
    fontDisplay.variable,
    fontBody.variable,
    fontSerif.variable,
    fontMono.variable
  ].join(' ');

  return (
    <html lang="tr" className={fontClasses} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </head>
      <body style={style} data-theme={isLight ? 'light' : 'dark'}>
        <a href="#main" className="skip-link">
          İçeriğe geç
        </a>
        <span id="top" />
        {children}
        <FloatingWhatsApp href={content.contact.whatsapp} />
        <CookieConsent />
        <div className="noise" aria-hidden="true" />
      </body>
    </html>
  );
}
