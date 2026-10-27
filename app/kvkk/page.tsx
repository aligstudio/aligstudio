import type { Metadata } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { getContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'KVKK Aydınlatma Metni',
    description:
      'ALIG Studio tarafından 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.',
    alternates: { canonical: '/kvkk' }
  };
}

export default async function KvkkPage() {
  const content = await getContent();

  return (
    <>
      <SiteHeader content={content} />
      <main id="main" className="legal-page">
        <div className="container legal-page__inner">
          <p className="eyebrow">
            <i aria-hidden="true" /> Yasal
          </p>
          <h1>KVKK Aydınlatma Metni</h1>
          <p className="legal-page__lead">
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) uyarınca, kişisel
            verilerinizin hangi amaçlarla işlendiği ve haklarınız hakkında sizi bilgilendirmek
            isteriz.
          </p>

          <section>
            <h2>1. Veri Sorumlusu</h2>
            <p>
              Veri sorumlusu ALIG Studio&rsquo;dur. İletişim adresimiz:{' '}
              <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>.
            </p>
          </section>

          <section>
            <h2>2. İşlenen Kişisel Veriler</h2>
            <p>
              İletişim formunu kullandığınızda bize ilettiğiniz ad, e-posta adresi, firma adı,
              konu ve mesaj içeriği işlenir. Bunların dışında site üzerinden kişisel veri
              toplanmaz; takip, reklam veya profil oluşturma çerezi kullanılmaz.
            </p>
          </section>

          <section>
            <h2>3. İşleme Amaçları ve Hukuki Sebep</h2>
            <p>
              Verileriniz; talebinize yanıt vermek, teklif ve hizmet süreçlerini yürütmek ve
              meşru menfaatlerimiz kapsamında iletişim kayıtlarını tutmak amacıyla, KVKK m.5
              kapsamında işlenir.
            </p>
          </section>

          <section>
            <h2>4. Aktarım</h2>
            <p>
              Kişisel verileriniz, yalnızca hizmetin gerektirdiği ölçüde barındırma ve e-posta
              sağlayıcılarımızla ve yasal zorunluluk hâlinde yetkili kurumlarla paylaşılır; üçüncü
              taraflarla pazarlama amacıyla paylaşılmaz.
            </p>
          </section>

          <section>
            <h2>5. Saklama Süresi</h2>
            <p>
              İletişim kayıtları, talebinizin niteliğine göre en fazla 2 yıl süreyle tutulur;
              sonrasında silinir veya anonimleştirilir.
            </p>
          </section>

          <section>
            <h2>6. Haklarınız</h2>
            <p>
              KVKK m.11 uyarınca; kişisel verinizin işlenip işlenmediğini öğrenme, düzeltilmesini
              veya silinmesini isteme ve işleme faaliyetlerine itiraz etme haklarına sahipsiniz.
              Başvurularınızı <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>{' '}
              adresine iletebilirsiniz.
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
