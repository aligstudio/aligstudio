export type LinkItem = {
  label: string;
  href: string;
};

export type StatItem = {
  value: string;
  label: string;
};

export type SocialItem = {
  platform: string;
  url: string;
};

export type ClientItem = {
  name: string;
  category: string;
  url: string;
};

export type ServiceItem = {
  icon: string;
  title: string;
  description: string;
  tags: string[];
};

export type WorkItem = {
  title: string;
  category: string;
  year: string;
  description: string;
  details: string;
  tags: string[];
  image: string;
  url: string;
  accent: string;
};

export type ProcessItem = {
  title: string;
  description: string;
};

export type YouTubeVideo = {
  title: string;
  youtubeId: string;
  duration: string;
};

export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type SiteContent = {
  brand: {
    name: string;
    logoText: string;
    logoImage: string;
    tagline: string;
    bg: string;
    bgElevated: string;
    ink: string;
    muted: string;
    accent: string;
    accentSoft: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
  header: {
    ctaLabel: string;
    ctaHref: string;
    mobileTitle: string;
    mobileCtaLabel: string;
  };
  sections: {
    showMarquee: boolean;
    showClients: boolean;
    showServices: boolean;
    showWorks: boolean;
    showAbout: boolean;
    showProcess: boolean;
    showYoutube: boolean;
    showTestimonials: boolean;
    showFaq: boolean;
    showContact: boolean;
  };
  nav: LinkItem[];
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    availability: string;
    primaryCta: LinkItem;
    secondaryCta: LinkItem;
    showcase: {
      badge: string;
      title: string;
      subtitle: string;
      videoUrl: string;
      image: string;
    };
    stats: StatItem[];
    tags: string[];
  };
  marquee: string[];
  clients: {
    eyebrow: string;
    items: ClientItem[];
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
    allLinkLabel: string;
    calloutText: string;
    calloutCtaLabel: string;
    calloutCtaHref: string;
    items: ServiceItem[];
  };
  works: {
    eyebrow: string;
    title: string;
    description: string;
    allLinkLabel: string;
    filterAllLabel: string;
    calloutText: string;
    calloutCtaLabel: string;
    calloutCtaHref: string;
    labels: {
      backToWorks: string;
      year: string;
      category: string;
      scope: string;
      liveLink: string;
      visitProject: string;
      comingSoon: string;
      similarPrompt: string;
      similarCta: string;
      nextWork: string;
    };
    items: WorkItem[];
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    badgeTop: string;
    badgeBottom: string;
    ctaLabel: string;
    ctaHref: string;
    points: string[];
    stats: StatItem[];
  };
  process: {
    eyebrow: string;
    title: string;
    description: string;
    items: ProcessItem[];
  };
  youtube: {
    eyebrow: string;
    title: string;
    description: string;
    channelUrl: string;
    handle: string;
    subscribers: string;
    ctaLabel: string;
    videos: YouTubeVideo[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    items: TestimonialItem[];
  };
  faq: {
    eyebrow: string;
    title: string;
    description: string;
    items: FaqItem[];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    email: string;
    phone: string;
    whatsapp: string;
    location: string;
    responseBadge: string;
    formTitle: string;
    formNote: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    topicLabel: string;
    topics: string[];
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
    sendingLabel: string;
    newMessageLabel: string;
    privacyNote: string;
    successTitle: string;
    successMessage: string;
    errorGeneric: string;
    errorNetwork: string;
  };
  social: SocialItem[];
  footer: {
    note: string;
    copyright: string;
    statusText: string;
    menuTitle: string;
    studioTitle: string;
    socialTitle: string;
    signatureText: string;
    backToTopLabel: string;
  };
  notFound: {
    code: string;
    title: string;
    description: string;
    ctaLabel: string;
  };
};

export type StorageMode = 'blob' | 'github' | 'local' | 'locked';
