import type { Metadata } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { getContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Gizlilik & Çerez Politikası',
    description:
      'ALIG Studio gizlilik ve çerez politikası: kullanılan zorunlu çerezler ve veri işleme ilkelerimiz.',
    alternates: { canonical: '/gizlilik' }
  };
}

export default async function PrivacyPage() {
  const content = await getContent();

  return (
    <>
      <SiteHeader content={content} />
      <main id="main" className="legal-page">
        <div className="container legal-page__inner">
          <p className="eyebrow">
            <i aria-hidden="true" /> Yasal
          </p>
          <h1>Gizlilik &amp; Çerez Politikası</h1>
          <p className="legal-page__lead">
            Bu site, çalışması için gerekli olan zorunlu çerezler dışında hiçbir çerezi kullanmaz.
            Takip, analitik veya reklam çerezi bulunmaz.
          </p>

          <section>
            <h2>1. Zorunlu Çerezler</h2>
            <p>
              Zorunlu çerezler; sayfanın düzgün çalışması, çerez bildiriminin bir daha sorulmaması
              ve güvenlik gibi temel işlevler için kullanılır. Bunlar olmadan site beklenen şekilde
              çalışmaz. Tarayıcı ayarlarınızdan silebilirsiniz; silerseniz bildirim yeniden gösterilir.
            </p>
          </section>

          <section>
            <h2>2. Çerez Onay Kaydı</h2>
            <p>
              Bildirimde &ldquo;Kabul Et&rdquo; dediğinizde, yalnızca onay tarihi, ziyaret edilen
              sayfa ve tarayıcı türü gibi kişisel olmayan bilgiler kayıt altına alınır. IP adresi
              veya benzersiz bir takip tanımlayıcısı saklanmaz.
            </p>
          </section>

          <section>
            <h2>3. İletişim Formu</h2>
            <p>
              Formda paylaştığınız bilgiler yalnızca talebinize yanıt vermek için kullanılır ve
              gizli tutulur. Ayrıntılar için{' '}
              <a href="/kvkk">KVKK Aydınlatma Metni</a>&rsquo;ne bakabilirsiniz.
            </p>
          </section>

          <section>
            <h2>4. Üçüncü Taraf Bağlantıları</h2>
            <p>
              Sitedeki sosyal medya ve WhatsApp bağlantıları üçüncü taraf sitelere götürür; bu
              sitelerin kendi gizlilik politikaları geçerlidir.
            </p>
          </section>

          <section>
            <h2>5. İletişim</h2>
            <p>
              Gizlilikle ilgili sorularınız için:{' '}
              <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>.
            </p>
          </section>

          <p className="legal-page__note">
            Bu metin bilgilendirme amaçlı bir taslaktır; hukuki danışmanlık yerine geçmez.
          </p>
        </div>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
