import { cache } from 'react';
import defaultContentJson from '@/content/site.json';
import {
  deepMerge,
  extractYouTubeId,
  isPlainObject,
  normalizeHex,
  safeHref,
  safeImageSrc
} from './utils';
import type { SiteContent } from './types';
import { getStorageMode, readStoredContent, writeStoredContent } from './storage';

export const defaultContent = defaultContentJson as unknown as SiteContent;

export { getStorageMode };

/**
 * Keeps externally editable values safe even if content is written directly
 * to storage or imported via JSON backup.
 */
function sanitizeContent(content: SiteContent): SiteContent {
  content.brand.logoImage = safeImageSrc(content.brand.logoImage, '');
  content.brand.bg = normalizeHex(content.brand.bg, defaultContent.brand.bg);
  content.brand.bgElevated = normalizeHex(
    content.brand.bgElevated,
    defaultContent.brand.bgElevated
  );
  content.brand.ink = normalizeHex(content.brand.ink, defaultContent.brand.ink);
  content.brand.muted = normalizeHex(content.brand.muted, defaultContent.brand.muted);
  content.brand.accent = normalizeHex(content.brand.accent, defaultContent.brand.accent);
  content.brand.accentSoft = normalizeHex(
    content.brand.accentSoft,
    defaultContent.brand.accentSoft
  );

  content.seo.ogImage = safeImageSrc(content.seo.ogImage, '');
  content.about.image = safeImageSrc(content.about.image, '');
  content.about.ctaHref = safeHref(content.about.ctaHref, '/hizmetler');

  content.header = {
    ctaLabel:
      typeof content.header?.ctaLabel === 'string' && content.header.ctaLabel.trim()
        ? content.header.ctaLabel
        : defaultContent.header.ctaLabel,
    ctaHref: safeHref(content.header?.ctaHref, defaultContent.header.ctaHref),
    mobileTitle:
      typeof content.header?.mobileTitle === 'string' && content.header.mobileTitle.trim()
        ? content.header.mobileTitle
        : defaultContent.header.mobileTitle,
    mobileCtaLabel:
      typeof content.header?.mobileCtaLabel === 'string' && content.header.mobileCtaLabel.trim()
        ? content.header.mobileCtaLabel
        : defaultContent.header.mobileCtaLabel
  };

  content.sections = {
    showMarquee: Boolean(content.sections?.showMarquee ?? true),
    showClients: Boolean(content.sections?.showClients ?? true),
    showServices: Boolean(content.sections?.showServices ?? true),
    showWorks: Boolean(content.sections?.showWorks ?? true),
    showAbout: Boolean(content.sections?.showAbout ?? true),
    showProcess: Boolean(content.sections?.showProcess ?? true),
    showYoutube: Boolean(content.sections?.showYoutube ?? true),
    showTestimonials: Boolean(content.sections?.showTestimonials ?? true),
    showFaq: Boolean(content.sections?.showFaq ?? true),
    showContact: Boolean(content.sections?.showContact ?? true)
  };

  content.nav = (Array.isArray(content.nav) ? content.nav : defaultContent.nav).map((item) => ({
    label: typeof item?.label === 'string' ? item.label : '',
    href: safeHref(item?.href, '/')
  }));

  content.social = (Array.isArray(content.social) ? content.social : defaultContent.social).map(
    (item) => ({
      platform: typeof item?.platform === 'string' ? item.platform : 'instagram',
      url: safeHref(item?.url, '')
    })
  );

  content.hero.primaryCta = {
    label:
      typeof content.hero.primaryCta?.label === 'string'
        ? content.hero.primaryCta.label
        : defaultContent.hero.primaryCta.label,
    href: safeHref(content.hero.primaryCta?.href, '#iletisim')
  };
  content.hero.secondaryCta = {
    label:
      typeof content.hero.secondaryCta?.label === 'string'
        ? content.hero.secondaryCta.label
        : defaultContent.hero.secondaryCta.label,
    href: safeHref(content.hero.secondaryCta?.href, '/calismalar')
  };

  content.hero.showcase = {
    badge:
      typeof content.hero.showcase?.badge === 'string'
        ? content.hero.showcase.badge
        : defaultContent.hero.showcase.badge,
    title:
      typeof content.hero.showcase?.title === 'string'
        ? content.hero.showcase.title
        : defaultContent.hero.showcase.title,
    subtitle:
      typeof content.hero.showcase?.subtitle === 'string'
        ? content.hero.showcase.subtitle
        : defaultContent.hero.showcase.subtitle,
    videoUrl:
      typeof content.hero.showcase?.videoUrl === 'string'
        ? extractYouTubeId(content.hero.showcase.videoUrl) ||
          safeHref(content.hero.showcase.videoUrl, '')
        : '',
    image: safeImageSrc(content.hero.showcase?.image, '')
  };

  content.clients.items = (
    Array.isArray(content.clients?.items) ? content.clients.items : defaultContent.clients.items
  ).map((item) => ({
    name: typeof item?.name === 'string' ? item.name : '',
    category: typeof item?.category === 'string' ? item.category : '',
    url: safeHref(item?.url, '')
  }));

  content.services.calloutCtaHref = safeHref(
    content.services.calloutCtaHref,
    defaultContent.services.calloutCtaHref
  );
  content.services.items = (
    Array.isArray(content.services.items) ? content.services.items : defaultContent.services.items
  ).map((item) => ({
    icon: typeof item?.icon === 'string' ? item.icon : 'spark',
    title: typeof item?.title === 'string' ? item.title : '',
    description: typeof item?.description === 'string' ? item.description : '',
    tags: Array.isArray(item?.tags) ? item.tags.map((t) => String(t ?? '')) : []
  }));

  content.works.calloutCtaHref = safeHref(
    content.works.calloutCtaHref,
    defaultContent.works.calloutCtaHref
  );
  content.works.items = (
    Array.isArray(content.works.items) ? content.works.items : defaultContent.works.items
  ).map((item) => ({
    ...item,
    title: typeof item?.title === 'string' ? item.title : '',
    category: typeof item?.category === 'string' ? item.category : '',
    year: typeof item?.year === 'string' ? item.year : '',
    description: typeof item?.description === 'string' ? item.description : '',
    details: typeof item?.details === 'string' ? item.details : '',
    tags: Array.isArray(item?.tags) ? item.tags.map((t) => String(t ?? '')) : [],
    accent: normalizeHex(item?.accent, content.brand.accent),
    image: safeImageSrc(item?.image, ''),
    url: safeHref(item?.url, '')
  }));

  content.youtube.channelUrl = safeHref(content.youtube.channelUrl, '');
  content.youtube.videos = (
    Array.isArray(content.youtube.videos) ? content.youtube.videos : defaultContent.youtube.videos
  ).map((video) => ({
    title: typeof video?.title === 'string' ? video.title : '',
    youtubeId: extractYouTubeId(video?.youtubeId),
    duration: typeof video?.duration === 'string' ? video.duration : ''
  }));

  content.faq.items = (
    Array.isArray(content.faq?.items) ? content.faq.items : defaultContent.faq.items
  ).map((item) => ({
    question: typeof item?.question === 'string' ? item.question : '',
    answer: typeof item?.answer === 'string' ? item.answer : ''
  }));

  content.contact.whatsapp = safeHref(content.contact.whatsapp, '');
  content.contact.email =
    typeof content.contact.email === 'string'
      ? content.contact.email.replace(/[\r\n<>]/g, '').trim().slice(0, 200)
      : defaultContent.contact.email;
  content.contact.topics = (
    Array.isArray(content.contact?.topics) && content.contact.topics.length > 0
      ? content.contact.topics
      : defaultContent.contact.topics
  )
    .map((t) => String(t ?? '').trim())
    .filter(Boolean);

  return content;
}

/** Loads the published content, always merged onto the built-in defaults and deduplicated per request. */
export const getContent = cache(async (): Promise<SiteContent> => {
  let stored: unknown = null;
  try {
    stored = await readStoredContent();
  } catch (error) {
    console.error('[content] Uzak içerik okunamadı, varsayılanlar kullanılıyor.', error);
  }

  const content = deepMerge(defaultContent, stored ?? {});
  return sanitizeContent(content);
});

export class ContentValidationError extends Error {}

function assertText(value: unknown, field: string, max = 500): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new ContentValidationError(`${field} boş olamaz.`);
  }
  return value.trim().slice(0, max);
}

export async function saveContent(input: unknown): Promise<SiteContent> {
  if (!isPlainObject(input)) {
    throw new ContentValidationError('Geçersiz içerik verisi.');
  }

  const content = deepMerge(defaultContent, input);
  content.brand.name = assertText(content.brand.name, 'Marka adı', 80);
  content.brand.logoText = assertText(content.brand.logoText, 'Logo yazısı', 24);
  content.brand.tagline =
    typeof content.brand.tagline === 'string' ? content.brand.tagline.slice(0, 120) : '';
  content.hero.title = assertText(content.hero.title, 'Hero başlığı', 220);
  content.hero.titleAccent =
    typeof content.hero.titleAccent === 'string' ? content.hero.titleAccent.slice(0, 220) : '';
  content.seo.title = assertText(content.seo.title, 'SEO başlığı', 160);
  content.seo.description =
    typeof content.seo.description === 'string' ? content.seo.description.slice(0, 320) : '';

  const sanitized = sanitizeContent(content);

  if (JSON.stringify(sanitized).length > 1_500_000) {
    throw new ContentValidationError('İçerik boyutu çok büyük.');
  }

  await writeStoredContent(sanitized);
  return sanitized;
}
