export type AdminField = {
  key: string;
  label: string;
  kind:
    | 'text'
    | 'textarea'
    | 'color'
    | 'image'
    | 'select'
    | 'toggle'
    | 'object'
    | 'strings'
    | 'list';
  hint?: string;
  placeholder?: string;
  width?: 'full' | 'half';
  rows?: number;
  options?: { value: string; label: string }[];
  fields?: AdminField[];
  itemLabel?: string;
  addLabel?: string;
  newItem?: Record<string, unknown>;
};

export type AdminGroup = {
  title: string;
  description?: string;
  fields: AdminField[];
};

export type AdminTab = {
  id: string;
  label: string;
  icon: string;
  title: string;
  description: string;
  groups: AdminGroup[];
};

export type ThemePreset = {
  id: string;
  name: string;
  subtitle: string;
  colors: {
    bg: string;
    bgElevated: string;
    ink: string;
    muted: string;
    accent: string;
    accentSoft: string;
  };
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'obsidian-acid',
    name: 'Obsidian Acid',
    subtitle: 'Koyu Stüdyo • Asit Yeşili (Varsayılan)',
    colors: {
      bg: '#08090A',
      bgElevated: '#101211',
      ink: '#F2F2EC',
      muted: '#929891',
      accent: '#00E0FF',
      accentSoft: '#C9F7FF'
    }
  },
  {
    id: 'swiss-ivory',
    name: 'Swiss Ivory',
    subtitle: 'Açık Editoryal • Elektrik Turuncu',
    colors: {
      bg: '#F6F4EE',
      bgElevated: '#EAE6DC',
      ink: '#111210',
      muted: '#5C5F58',
      accent: '#FF4D1C',
      accentSoft: '#FF9E80'
    }
  },
  {
    id: 'cyber-cobalt',
    name: 'Cyber Cobalt',
    subtitle: 'Derin Gece • Elektrik Kobalt & Siyan',
    colors: {
      bg: '#070910',
      bgElevated: '#0F1320',
      ink: '#F0F4FF',
      muted: '#8D97B5',
      accent: '#5482FF',
      accentSoft: '#A3C0FF'
    }
  },
  {
    id: 'crimson-noir',
    name: 'Crimson Noir',
    subtitle: 'Sinematik Siyah • Mercan Kırmızısı',
    colors: {
      bg: '#0B0809',
      bgElevated: '#151012',
      ink: '#F7EFEF',
      muted: '#A39396',
      accent: '#FF5A52',
      accentSoft: '#FFB1AD'
    }
  },
  {
    id: 'espresso-sand',
    name: 'Espresso & Gold',
    subtitle: 'Sıcak Antrasit • Kehribar Altın',
    colors: {
      bg: '#0D0B09',
      bgElevated: '#171410',
      ink: '#F5F0E6',
      muted: '#A19887',
      accent: '#F4B942',
      accentSoft: '#FBE0A2'
    }
  }
];

const serviceIconOptions = [
  { value: 'share', label: 'Paylaşım / sosyal' },
  { value: 'film', label: 'Film / prodüksiyon' },
  { value: 'code', label: 'Kod / yazılım' },
  { value: 'play', label: 'Oynat / video' },
  { value: 'spark', label: 'Yıldız / yaratıcı' },
  { value: 'target', label: 'Hedef / strateji' },
  { value: 'camera', label: 'Kamera' },
  { value: 'layers', label: 'Katman / sistem' },
  { value: 'globe', label: 'Web / global' }
];

const socialOptions = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'behance', label: 'Behance' },
  { value: 'x', label: 'X / Twitter' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'mail', label: 'E-posta' }
];

const ctaFields: AdminField[] = [
  { key: 'label', label: 'Buton yazısı', kind: 'text', width: 'half' },
  { key: 'href', label: 'Bağlantı', kind: 'text', width: 'half', placeholder: '#iletisim' }
];

const statFields: AdminField[] = [
  { key: 'value', label: 'Değer', kind: 'text', width: 'half', placeholder: '50+' },
  { key: 'label', label: 'Etiket', kind: 'text', width: 'half', placeholder: 'proje' }
];

export const ADMIN_TABS: AdminTab[] = [
  {
    id: 'brand',
    label: 'Marka & Tema',
    icon: 'spark',
    title: 'Marka, Renk Paleti ve SEO',
    description: 'Logo, tüm site renkleri (arka plan, yazı, vurgu) ve arama motoru ayarları.',
    groups: [
      {
        title: 'Kimlik & Logo',
        description: 'Sitenin her yerinde görünen temel marka bilgileri.',
        fields: [
          {
            key: 'brand.name',
            label: 'Marka adı',
            kind: 'text',
            width: 'half',
            placeholder: 'ALIG Studio'
          },
          {
            key: 'brand.logoText',
            label: 'Logo yazısı',
            kind: 'text',
            width: 'half',
            placeholder: 'ALIG'
          },
          {
            key: 'brand.tagline',
            label: 'Slogan / alt başlık',
            kind: 'text',
            hint: 'Üst menüde logo yanında ve şemalarda kullanılır.'
          },
          {
            key: 'brand.logoImage',
            label: 'Logo görseli',
            kind: 'image',
            hint: 'Boş bırakırsan tipografik logo kullanılır.'
          }
        ]
      },
      {
        title: 'Site Renk Motoru (Tam Tema Kontrolü)',
        description:
          'İster üstteki hazır paletlerden birini seç, ister her rengi ayrı ayrı özelleştir. Kontrast ve kenarlık tonları otomatik hesaplanır.',
        fields: [
          {
            key: 'brand.bg',
            label: 'Ana arka plan rengi',
            kind: 'color',
            width: 'half',
            hint: 'Sayfa zemini (Koyu: #08090A, Açık: #F6F4EE)'
          },
          {
            key: 'brand.bgElevated',
            label: 'Kart & yüzey rengi',
            kind: 'color',
            width: 'half',
            hint: 'Kartların ve panellerin zemin rengi'
          },
          {
            key: 'brand.ink',
            label: 'Ana yazı rengi',
            kind: 'color',
            width: 'half',
            hint: 'Başlık ve ana metin rengi'
          },
          {
            key: 'brand.muted',
            label: 'İkincil yazı rengi',
            kind: 'color',
            width: 'half',
            hint: 'Açıklama ve yardımcı metin rengi'
          },
          {
            key: 'brand.accent',
            label: 'Ana vurgu rengi',
            kind: 'color',
            width: 'half',
            hint: 'Butonlar, rozetler ve vurgulu kelimeler'
          },
          {
            key: 'brand.accentSoft',
            label: 'Yumuşak vurgu rengi',
            kind: 'color',
            width: 'half',
            hint: 'İkincil ışıma ve geçiş tonu'
          }
        ]
      },
      {
        title: 'SEO & Sosyal Paylaşım',
        description: 'Google ve sosyal medya paylaşımlarında görünen bilgiler.',
        fields: [
          {
            key: 'seo.title',
            label: 'Site başlığı',
            kind: 'text',
            hint: '55–60 karakter önerilir.'
          },
          { key: 'seo.description', label: 'Açıklama', kind: 'textarea', rows: 3 },
          {
            key: 'seo.keywords',
            label: 'Anahtar kelimeler',
            kind: 'text',
            hint: 'Virgülle ayır: sosyal medya ajansı, reklam, yazılım'
          },
          {
            key: 'seo.ogImage',
            label: 'Paylaşım görseli (OG)',
            kind: 'image',
            hint: 'Boşsa sitenin renkleriyle otomatik kapak görseli oluşturulur.'
          }
        ]
      }
    ]
  },
  {
    id: 'navigation',
    label: 'Menü & Bölümler',
    icon: 'layers',
    title: 'Üst Menü ve Bölüm Görünürlüğü',
    description: 'Menü linklerini, sağ üst butonu ve ana sayfadaki bölümlerin açık/kapalı durumunu yönet.',
    groups: [
      {
        title: 'Üst Menü & Başlık Butonu',
        description: 'Sitenin en üstündeki sabit navigasyon çubuğu.',
        fields: [
          {
            key: 'header.ctaLabel',
            label: 'Sağ üst buton yazısı',
            kind: 'text',
            width: 'half',
            placeholder: 'Başlayalım'
          },
          {
            key: 'header.ctaHref',
            label: 'Sağ üst buton bağlantısı',
            kind: 'text',
            width: 'half',
            placeholder: '/#iletisim'
          },
          {
            key: 'header.mobileTitle',
            label: 'Mobil menü üst etiketi',
            kind: 'text',
            width: 'half',
            placeholder: 'Menü'
          },
          {
            key: 'header.mobileCtaLabel',
            label: 'Mobil menü alt buton yazısı',
            kind: 'text',
            width: 'half',
            placeholder: 'Projeni anlat'
          },
          {
            key: 'nav',
            label: 'Menü bağlantıları',
            kind: 'list',
            itemLabel: 'label',
            addLabel: 'Menü öğesi ekle',
            newItem: { label: 'Yeni sayfa', href: '/#iletisim' },
            fields: [
              { key: 'label', label: 'Görünen ad', kind: 'text', width: 'half' },
              { key: 'href', label: 'Bağlantı', kind: 'text', width: 'half' }
            ]
          }
        ]
      },
      {
        title: 'Ana Sayfa Bölüm Görünürlüğü',
        description: 'Ana sayfada görünmesini istemediğin bölümleri tek tıkla gizleyebilirsin.',
        fields: [
          {
            key: 'sections.showMarquee',
            label: 'Kayan kelime şeridini göster',
            kind: 'toggle',
            width: 'half'
          },
          {
            key: 'sections.showClients',
            label: 'Markalar / müşteriler şeridini göster',
            kind: 'toggle',
            width: 'half'
          },
          {
            key: 'sections.showServices',
            label: 'Hizmetler bölümünü göster',
            kind: 'toggle',
            width: 'half'
          },
          {
            key: 'sections.showWorks',
            label: 'Seçili çalışmalar bölümünü göster',
            kind: 'toggle',
            width: 'half'
          },
          {
            key: 'sections.showAbout',
            label: 'Stüdyo / hakkımızda bölümünü göster',
            kind: 'toggle',
            width: 'half'
          },
          {
            key: 'sections.showProcess',
            label: 'Çalışma süreci bölümünü göster',
            kind: 'toggle',
            width: 'half'
          },
          {
            key: 'sections.showYoutube',
            label: 'YouTube bölümünü göster',
            kind: 'toggle',
            width: 'half'
          },
          {
            key: 'sections.showTestimonials',
            label: 'Referanslar bölümünü göster',
            kind: 'toggle',
            width: 'half'
          },
          {
            key: 'sections.showFaq',
            label: 'Sıkça sorulan sorular (SSS) bölümünü göster',
            kind: 'toggle',
            width: 'half'
          },
          {
            key: 'sections.showContact',
            label: 'İletişim & brief bölümünü göster',
            kind: 'toggle',
            width: 'half'
          }
        ]
      }
    ]
  },
  {
    id: 'home',
    label: 'Hero & Markalar',
    icon: 'layout',
    title: 'Hero, Showreel Vitrini ve Markalar',
    description: 'Ziyaretçinin ilk gördüğü ekran, sağ vitrin kartı, kayan şerit ve referans markalar.',
    groups: [
      {
        title: 'Hero Sol Alan (Ana Başlık & Butonlar)',
        description: 'Ana mesaj, kontenjan durumu ve eylem butonları.',
        fields: [
          { key: 'hero.eyebrow', label: 'Üst etiket', kind: 'text', width: 'half' },
          { key: 'hero.availability', label: 'Kontenjan / durum rozeti', kind: 'text', width: 'half' },
          { key: 'hero.title', label: 'Başlık (düz satır)', kind: 'text' },
          {
            key: 'hero.titleAccent',
            label: 'Başlık (vurgulu satır)',
            kind: 'text',
            hint: 'Serif italik ve vurgu rengiyle gösterilir.'
          },
          { key: 'hero.description', label: 'Açıklama', kind: 'textarea', rows: 3 },
          {
            key: 'hero.primaryCta',
            label: 'Birincil buton',
            kind: 'object',
            fields: ctaFields
          },
          {
            key: 'hero.secondaryCta',
            label: 'İkincil buton',
            kind: 'object',
            fields: ctaFields
          },
          {
            key: 'hero.tags',
            label: 'Disiplin etiketleri',
            kind: 'strings',
            addLabel: 'Etiket ekle',
            hint: 'Hero altında ve sağ vitrinde gösterilir.'
          },
          {
            key: 'hero.stats',
            label: 'Hero istatistikleri',
            kind: 'list',
            itemLabel: 'label',
            addLabel: 'İstatistik ekle',
            newItem: { value: '00+', label: 'yeni metrik' },
            fields: statFields
          }
        ]
      },
      {
        title: 'Hero Sağ Vitrin (Showreel & Stüdyo Kartı)',
        description: 'Sağ taraftaki interaktif stüdyo vitrininin yazıları ve opsiyonel medya bağlantısı.',
        fields: [
          {
            key: 'hero.showcase.badge',
            label: 'Vitrin üst rozeti',
            kind: 'text',
            width: 'half',
            placeholder: 'STÜDYO VİTRİNİ • 04 DİSİPLİN'
          },
          {
            key: 'hero.showcase.subtitle',
            label: 'Vitrin alt satırı',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'hero.showcase.title',
            label: 'Vitrin başlığı',
            kind: 'text'
          },
          {
            key: 'hero.showcase.videoUrl',
            label: 'Showreel YouTube bağlantısı veya ID (opsiyonel)',
            kind: 'text',
            hint: 'Doldurursan vitrinde Showreel oynatıcı butonu aktif olur.'
          },
          {
            key: 'hero.showcase.image',
            label: 'Vitrin özel kapak görseli (opsiyonel)',
            kind: 'image',
            hint: 'Boş bırakırsan interaktif 4 disiplin bento vitrini gösterilir.'
          }
        ]
      },
      {
        title: 'Kayan Şerit & Markalar',
        description: 'Hero altında akan anahtar kelimeler ve iş birliği yapılan markalar.',
        fields: [
          {
            key: 'marquee',
            label: 'Kayan şerit kelimeleri',
            kind: 'strings',
            addLabel: 'Kelime ekle'
          },
          {
            key: 'clients.eyebrow',
            label: 'Markalar bölümü başlığı',
            kind: 'text'
          },
          {
            key: 'clients.items',
            label: 'Markalar / Müşteriler',
            kind: 'list',
            itemLabel: 'name',
            addLabel: 'Marka ekle',
            newItem: { name: 'Yeni Marka', category: 'Dijital Kampanya', url: '' },
            fields: [
              { key: 'name', label: 'Marka adı', kind: 'text', width: 'half' },
              { key: 'category', label: 'Alan / yapılan iş', kind: 'text', width: 'half' },
              { key: 'url', label: 'Bağlantı (opsiyonel)', kind: 'text' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'services',
    label: 'Hizmetler',
    icon: 'target',
    title: 'Hizmetler',
    description: 'Hizmet kartları, bölüm başlıkları ve hizmetler sayfası alt çağrı alanı.',
    groups: [
      {
        title: 'Bölüm Başlığı & Alt Çağrı Kutusu',
        fields: [
          { key: 'services.eyebrow', label: 'Üst etiket', kind: 'text', width: 'half' },
          {
            key: 'services.allLinkLabel',
            label: 'Sağ üst bağlantı yazısı',
            kind: 'text',
            width: 'half',
            placeholder: 'Tüm hizmetler'
          },
          { key: 'services.title', label: 'Başlık', kind: 'text' },
          { key: 'services.description', label: 'Açıklama', kind: 'textarea', rows: 3 },
          {
            key: 'services.calloutText',
            label: 'Hizmetler sayfası alt çağrı metni',
            kind: 'textarea',
            rows: 2
          },
          {
            key: 'services.calloutCtaLabel',
            label: 'Alt çağrı buton yazısı',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'services.calloutCtaHref',
            label: 'Alt çağrı buton bağlantısı',
            kind: 'text',
            width: 'half'
          }
        ]
      },
      {
        title: 'Hizmet Kartları',
        description: 'Her kart ana sayfada ve /hizmetler sayfasında görünür.',
        fields: [
          {
            key: 'services.items',
            label: 'Hizmetler',
            kind: 'list',
            itemLabel: 'title',
            addLabel: 'Hizmet ekle',
            newItem: {
              icon: 'spark',
              title: 'Yeni hizmet',
              description: 'Kısa bir açıklama yaz.',
              tags: ['Etiket']
            },
            fields: [
              {
                key: 'icon',
                label: 'İkon',
                kind: 'select',
                options: serviceIconOptions,
                width: 'half'
              },
              { key: 'title', label: 'Başlık', kind: 'text', width: 'half' },
              { key: 'description', label: 'Açıklama', kind: 'textarea', rows: 3 },
              { key: 'tags', label: 'Kapsam etiketleri', kind: 'strings', addLabel: 'Etiket ekle' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'works',
    label: 'Çalışmalar',
    icon: 'grid',
    title: 'Portfolyo & Vaka Sayfası Metinleri',
    description: 'Projeler, kategori filtreleri ve proje detay sayfasındaki tüm etiketler.',
    groups: [
      {
        title: 'Bölüm Başlığı & Çağrı Kutusu',
        fields: [
          { key: 'works.eyebrow', label: 'Üst etiket', kind: 'text', width: 'half' },
          {
            key: 'works.allLinkLabel',
            label: 'Sağ üst bağlantı yazısı',
            kind: 'text',
            width: 'half',
            placeholder: 'Tüm çalışmalar'
          },
          { key: 'works.title', label: 'Başlık', kind: 'text', width: 'half' },
          {
            key: 'works.filterAllLabel',
            label: 'Filtre "Tümü" butonu yazısı',
            kind: 'text',
            width: 'half'
          },
          { key: 'works.description', label: 'Açıklama', kind: 'textarea', rows: 3 },
          {
            key: 'works.calloutText',
            label: 'Çalışmalar sayfası alt çağrı metni',
            kind: 'textarea',
            rows: 2
          },
          {
            key: 'works.calloutCtaLabel',
            label: 'Alt çağrı buton yazısı',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'works.calloutCtaHref',
            label: 'Alt çağrı buton bağlantısı',
            kind: 'text',
            width: 'half'
          }
        ]
      },
      {
        title: 'Projeler',
        description: 'Görsel yüklemezsen projenin vurgu rengiyle özel tipografik poster üretilir.',
        fields: [
          {
            key: 'works.items',
            label: 'Çalışmalar',
            kind: 'list',
            itemLabel: 'title',
            addLabel: 'Proje ekle',
            newItem: {
              title: 'Yeni proje',
              category: 'Sosyal Medya',
              year: '2026',
              description: '',
              details: '',
              tags: [],
              image: '',
              url: '',
              accent: '#C6F24E'
            },
            fields: [
              { key: 'title', label: 'Proje adı', kind: 'text', width: 'half' },
              { key: 'category', label: 'Kategori', kind: 'text', width: 'half' },
              { key: 'year', label: 'Yıl', kind: 'text', width: 'half' },
              { key: 'accent', label: 'Poster vurgu rengi', kind: 'color', width: 'half' },
              { key: 'description', label: 'Kısa açıklama', kind: 'textarea', rows: 3 },
              {
                key: 'details',
                label: 'Vaka detayı',
                kind: 'textarea',
                rows: 5,
                hint: 'Proje detay sayfasında görünür. Paragrafları boş satırla ayır.'
              },
              { key: 'image', label: 'Kapak görseli', kind: 'image' },
              {
                key: 'url',
                label: 'Dış bağlantı',
                kind: 'text',
                hint: 'Varsa canlı proje / vaka bağlantısı (https://...).'
              },
              { key: 'tags', label: 'Etiketler', kind: 'strings', addLabel: 'Etiket ekle' }
            ]
          }
        ]
      },
      {
        title: 'Proje Detay Sayfası Etiketleri',
        description: 'Vaka analizi sayfasındaki arayüz metinleri.',
        fields: [
          {
            key: 'works.labels.backToWorks',
            label: 'Geri dön linki',
            kind: 'text',
            width: 'half'
          },
          { key: 'works.labels.year', label: 'Yıl etiketi', kind: 'text', width: 'half' },
          { key: 'works.labels.category', label: 'Kategori etiketi', kind: 'text', width: 'half' },
          { key: 'works.labels.scope', label: 'Kapsam etiketi', kind: 'text', width: 'half' },
          { key: 'works.labels.liveLink', label: 'Bağlantı etiketi', kind: 'text', width: 'half' },
          {
            key: 'works.labels.visitProject',
            label: 'Projeyi gör yazısı',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'works.labels.comingSoon',
            label: 'Detay yoksa görünen yazı',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'works.labels.nextWork',
            label: 'Sıradaki çalışma etiketi',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'works.labels.similarPrompt',
            label: 'Benzer iş sorusu',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'works.labels.similarCta',
            label: 'Benzer iş buton yazısı',
            kind: 'text',
            width: 'half'
          }
        ]
      }
    ]
  },
  {
    id: 'studio',
    label: 'Stüdyo & Süreç',
    icon: 'user',
    title: 'Stüdyo ve Çalışma Süreci',
    description: 'Hakkımızda alanı, görsel rozetleri, istatistikler ve 4 adımlı çalışma süreci.',
    groups: [
      {
        title: 'Hakkımızda (Stüdyo)',
        fields: [
          { key: 'about.eyebrow', label: 'Üst etiket', kind: 'text', width: 'half' },
          { key: 'about.title', label: 'Başlık', kind: 'text' },
          { key: 'about.description', label: 'Açıklama', kind: 'textarea', rows: 4 },
          { key: 'about.image', label: 'Stüdyo görseli', kind: 'image' },
          {
            key: 'about.badgeTop',
            label: 'Görsel üst rozet yazısı',
            kind: 'text',
            width: 'half',
            placeholder: 'STUDIO / ISTANBUL'
          },
          {
            key: 'about.badgeBottom',
            label: 'Görsel alt rozet yazısı',
            kind: 'text',
            width: 'half',
            placeholder: 'İçerik • Prodüksiyon • Yazılım'
          },
          {
            key: 'about.ctaLabel',
            label: 'Stüdyo buton yazısı',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'about.ctaHref',
            label: 'Stüdyo buton bağlantısı',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'about.points',
            label: 'Öne çıkan maddeler',
            kind: 'strings',
            addLabel: 'Madde ekle'
          },
          {
            key: 'about.stats',
            label: 'Stüdyo istatistikleri',
            kind: 'list',
            itemLabel: 'label',
            addLabel: 'İstatistik ekle',
            newItem: { value: '00', label: 'yeni metrik' },
            fields: statFields
          }
        ]
      },
      {
        title: 'Süreç Adımları',
        description: 'Keşif, strateji, üretim ve yayın adımları.',
        fields: [
          { key: 'process.eyebrow', label: 'Üst etiket', kind: 'text', width: 'half' },
          { key: 'process.title', label: 'Başlık', kind: 'text', width: 'half' },
          { key: 'process.description', label: 'Açıklama', kind: 'textarea', rows: 2 },
          {
            key: 'process.items',
            label: 'Adımlar',
            kind: 'list',
            itemLabel: 'title',
            addLabel: 'Adım ekle',
            newItem: { title: 'Yeni adım', description: '' },
            fields: [
              { key: 'title', label: 'Adım adı', kind: 'text', width: 'half' },
              { key: 'description', label: 'Açıklama', kind: 'text' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: 'play',
    title: 'YouTube Bölümü',
    description: 'Kanal bilgileri, buton yazısı ve öne çıkan videolar.',
    groups: [
      {
        title: 'Kanal Bilgileri',
        fields: [
          { key: 'youtube.eyebrow', label: 'Üst etiket', kind: 'text', width: 'half' },
          { key: 'youtube.ctaLabel', label: 'Buton yazısı', kind: 'text', width: 'half' },
          { key: 'youtube.title', label: 'Başlık', kind: 'text' },
          { key: 'youtube.description', label: 'Açıklama', kind: 'textarea', rows: 3 },
          { key: 'youtube.channelUrl', label: 'Kanal bağlantısı', kind: 'text' },
          { key: 'youtube.handle', label: 'Kanal kullanıcı adı (@)', kind: 'text', width: 'half' },
          { key: 'youtube.subscribers', label: 'Kanal alt bilgisi', kind: 'text', width: 'half' }
        ]
      },
      {
        title: 'Videolar',
        description:
          'YouTube video bağlantısını (https://...) veya 11 haneli video kimliğini (ID) yapıştırırsan gerçek kapak görseli otomatik yüklenir.',
        fields: [
          {
            key: 'youtube.videos',
            label: 'Öne çıkan videolar',
            kind: 'list',
            itemLabel: 'title',
            addLabel: 'Video ekle',
            newItem: { title: 'Yeni video', youtubeId: '', duration: '' },
            fields: [
              { key: 'title', label: 'Video başlığı', kind: 'text' },
              {
                key: 'youtubeId',
                label: 'YouTube ID veya bağlantı',
                kind: 'text',
                width: 'half',
                placeholder: 'dQw4w9WgXcQ veya https://youtu.be/...'
              },
              { key: 'duration', label: 'Süre', kind: 'text', width: 'half', placeholder: '12:40' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'testimonials',
    label: 'Referans & SSS',
    icon: 'quote',
    title: 'Referanslar ve Sıkça Sorulan Sorular',
    description: 'Müşteri yorumları ve akordeon SSS (FAQ) bölümü.',
    groups: [
      {
        title: 'Referanslar (Müşteri Yorumları)',
        fields: [
          { key: 'testimonials.eyebrow', label: 'Üst etiket', kind: 'text', width: 'half' },
          { key: 'testimonials.title', label: 'Başlık', kind: 'text' },
          {
            key: 'testimonials.items',
            label: 'Yorumlar',
            kind: 'list',
            itemLabel: 'name',
            addLabel: 'Referans ekle',
            newItem: { quote: '', name: 'Yeni kişi', role: 'Marka' },
            fields: [
              { key: 'quote', label: 'Yorum', kind: 'textarea', rows: 3 },
              { key: 'name', label: 'Ad soyad', kind: 'text', width: 'half' },
              { key: 'role', label: 'Şirket / unvan', kind: 'text', width: 'half' }
            ]
          }
        ]
      },
      {
        title: 'Sıkça Sorulan Sorular (SSS / FAQ)',
        description: 'Google arama sonuçları için otomatik FAQ şeması da üretir.',
        fields: [
          { key: 'faq.eyebrow', label: 'Üst etiket', kind: 'text', width: 'half' },
          { key: 'faq.title', label: 'Başlık', kind: 'text', width: 'half' },
          { key: 'faq.description', label: 'Açıklama', kind: 'textarea', rows: 2 },
          {
            key: 'faq.items',
            label: 'Sorular & Cevaplar',
            kind: 'list',
            itemLabel: 'question',
            addLabel: 'Soru ekle',
            newItem: { question: 'Yeni soru?', answer: 'Cevap metni...' },
            fields: [
              { key: 'question', label: 'Soru', kind: 'text' },
              { key: 'answer', label: 'Cevap', kind: 'textarea', rows: 3 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'contact',
    label: 'İletişim & Form',
    icon: 'mail',
    title: 'İletişim Bilgileri ve Brief Formu',
    description: 'İletişim kanalları, sosyal medya ve formdaki her bir alanın/seçeneğin yazıları.',
    groups: [
      {
        title: 'İletişim Bilgileri',
        fields: [
          { key: 'contact.eyebrow', label: 'Üst etiket', kind: 'text', width: 'half' },
          {
            key: 'contact.responseBadge',
            label: 'Dönüş süresi rozeti',
            kind: 'text',
            width: 'half'
          },
          { key: 'contact.title', label: 'Başlık', kind: 'text' },
          { key: 'contact.description', label: 'Açıklama', kind: 'textarea', rows: 3 },
          { key: 'contact.email', label: 'E-posta', kind: 'text', width: 'half' },
          { key: 'contact.location', label: 'Konum', kind: 'text', width: 'half' },
          {
            key: 'contact.phone',
            label: 'Telefon',
            kind: 'text',
            width: 'half',
            hint: 'Boş bırakılırsa gösterilmez.'
          },
          {
            key: 'contact.whatsapp',
            label: 'WhatsApp bağlantısı',
            kind: 'text',
            width: 'half',
            hint: 'https://wa.me/905... biçiminde.'
          }
        ]
      },
      {
        title: 'Brief Formu Metinleri & Konu Seçenekleri',
        description: 'Formdaki tüm etiketleri, buton yazısını ve açılır menü seçeneklerini buradan düzenleyebilirsin.',
        fields: [
          { key: 'contact.formTitle', label: 'Form üst başlığı', kind: 'text', width: 'half' },
          { key: 'contact.formNote', label: 'Form açıklama notu', kind: 'text', width: 'half' },
          { key: 'contact.nameLabel', label: 'Ad alanı etiketi', kind: 'text', width: 'half' },
          {
            key: 'contact.namePlaceholder',
            label: 'Ad alanı ipucu (placeholder)',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'contact.emailLabel',
            label: 'E-posta alanı etiketi',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'contact.emailPlaceholder',
            label: 'E-posta alanı ipucu',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'contact.companyLabel',
            label: 'Marka/Şirket alanı etiketi',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'contact.companyPlaceholder',
            label: 'Marka/Şirket alanı ipucu',
            kind: 'text',
            width: 'half'
          },
          { key: 'contact.topicLabel', label: 'Konu alanı etiketi', kind: 'text', width: 'half' },
          { key: 'contact.submitLabel', label: 'Gönder butonu yazısı', kind: 'text', width: 'half' },
          {
            key: 'contact.topics',
            label: 'Konu seçenekleri (Açılır menü)',
            kind: 'strings',
            addLabel: 'Konu seçeneği ekle'
          },
          {
            key: 'contact.messageLabel',
            label: 'Mesaj alanı etiketi',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'contact.messagePlaceholder',
            label: 'Mesaj alanı ipucu',
            kind: 'text',
            width: 'half'
          },
          { key: 'contact.privacyNote', label: 'Form altı gizlilik notu', kind: 'text' },
          {
            key: 'contact.successTitle',
            label: 'Gönderim sonrası başarı başlığı',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'contact.successMessage',
            label: 'Gönderim sonrası başarı açıklaması',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'contact.sendingLabel',
            label: 'Gönderilirken buton yazısı',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'contact.newMessageLabel',
            label: 'Yeni mesaj butonu yazısı',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'contact.errorGeneric',
            label: 'Genel hata mesajı',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'contact.errorNetwork',
            label: 'Bağlantı hatası mesajı',
            kind: 'text',
            width: 'half'
          }
        ]
      },
      {
        title: 'Sosyal Medya Hesapları',
        fields: [
          {
            key: 'social',
            label: 'Bağlantılar',
            kind: 'list',
            itemLabel: 'platform',
            addLabel: 'Sosyal hesap ekle',
            newItem: { platform: 'instagram', url: 'https://' },
            fields: [
              {
                key: 'platform',
                label: 'Platform',
                kind: 'select',
                options: socialOptions,
                width: 'half'
              },
              { key: 'url', label: 'Bağlantı', kind: 'text', width: 'half' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'footer',
    label: 'Footer & 404',
    icon: 'globe',
    title: 'Footer ve Sistem Sayfaları',
    description: 'Alt bilgi (Footer) sütun başlıkları, durum rozeti, imza ve 404 sayfası metinleri.',
    groups: [
      {
        title: 'Footer (Alt Bilgi)',
        fields: [
          { key: 'footer.note', label: 'Stüdyo açıklaması', kind: 'textarea', rows: 3 },
          {
            key: 'footer.statusText',
            label: 'Yeşil durum rozeti yazısı',
            kind: 'text',
            width: 'half'
          },
          { key: 'footer.copyright', label: 'Telif satırı', kind: 'text', width: 'half' },
          { key: 'footer.menuTitle', label: '1. sütun başlığı (Menü)', kind: 'text', width: 'half' },
          {
            key: 'footer.studioTitle',
            label: '2. sütun başlığı (Stüdyo)',
            kind: 'text',
            width: 'half'
          },
          {
            key: 'footer.socialTitle',
            label: '3. sütun başlığı (Sosyal)',
            kind: 'text',
            width: 'half'
          },
          { key: 'footer.signatureText', label: 'Alt imza ön eki', kind: 'text', width: 'half' },
          {
            key: 'footer.backToTopLabel',
            label: 'Yukarı çık butonu yazısı',
            kind: 'text',
            width: 'half'
          }
        ]
      },
      {
        title: '404 Sayfa Bulunamadı Ekranı',
        fields: [
          { key: 'notFound.code', label: 'Üst kod satırı', kind: 'text', width: 'half' },
          { key: 'notFound.ctaLabel', label: 'Buton yazısı', kind: 'text', width: 'half' },
          { key: 'notFound.title', label: 'Başlık', kind: 'text' },
          { key: 'notFound.description', label: 'Açıklama', kind: 'textarea', rows: 2 }
        ]
      }
    ]
  }
];
