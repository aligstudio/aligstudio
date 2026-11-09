import { Clients } from '@/components/sections/Clients';
import { Contact } from '@/components/sections/Contact';
import { Faq } from '@/components/sections/Faq';
import { Hero } from '@/components/sections/Hero';
import { Process } from '@/components/sections/Process';
import { Services } from '@/components/sections/Services';
import { Studio } from '@/components/sections/Studio';
import { Testimonials } from '@/components/sections/Testimonials';
import { Works } from '@/components/sections/Works';
import { Youtube } from '@/components/sections/Youtube';
import { Marquee } from '@/components/Marquee';
import { RevealObserver } from '@/components/RevealObserver';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { getContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const content = await getContent();
  const s = content.sections;

  return (
    <>
      <RevealObserver />
      <SiteHeader content={content} />
      <main id="main">
        <Hero
          hero={content.hero}
          brand={content.brand}
          services={content.services.items}
        />
        {s.showMarquee ? <Marquee items={content.marquee} /> : null}
        {s.showClients ? <Clients clients={content.clients} /> : null}
        {s.showServices ? <Services services={content.services} /> : null}
        {s.showWorks ? <Works works={content.works} /> : null}
        {s.showAbout ? <Studio about={content.about} brand={content.brand} /> : null}
        {s.showProcess ? <Process process={content.process} /> : null}
        {s.showYoutube ? <Youtube youtube={content.youtube} /> : null}
        {s.showTestimonials ? <Testimonials testimonials={content.testimonials} /> : null}
        {s.showFaq ? <Faq faq={content.faq} /> : null}
        {s.showMarquee ? <Marquee items={content.marquee} reverse /> : null}
        {s.showContact ? <Contact contact={content.contact} social={content.social} /> : null}
      </main>
      <SiteFooter content={content} />
    </>
  );
}
