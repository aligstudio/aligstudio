# ALIG Studio — web sitesi + içerik paneli

ALIG Studio için tasarlanmış, Vercel üzerinde çalışan modern web sitesi ve tamamen panelden düzenlenebilen içerik sistemi.

- **Site:** sosyal medya, reklam prodüksiyonu, yazılım ve YouTube içerik üretimini tek bir yaratıcı teknoloji stüdyosu diliyle anlatır.
- **Panel:** logo, renkler, tüm metinler, menü, hizmetler, projeler, YouTube videoları, referanslar, iletişim bilgileri ve footer — hepsi tarayıcıdan düzenlenir.
- **Gizli panel adresi:** `/admin` kullanılmaz. Panel yalnızca `ADMIN_PATH` ortam değişkeninde tanımlı gizli adresten açılır; doğrudan `/admin` adresi 404 döner.
- **Teknoloji:** Next.js 15 (App Router), React 19, TypeScript, Vercel Blob.
- **Görseller:** panelden yüklenen logo ve proje kapakları Vercel Blob'da saklanır.

---

## 1. Hızlı başlangıç (yerel)

Gereksinim: **Node.js 20.9+** ve npm.

```bash
npm install
npm run dev
```

Site: `http://localhost:3000`

Panel: `http://localhost:3000/studio-7f3k9`

Yerel geliştirme şifresi: **`aligstudio`**

> Yerelde yapılan kayıtlar `.data/content.json` dosyasına yazılır. Bu dosya Git'e eklenmez.

Üretim derlemesini kontrol etmek için:

```bash
npm run build
npm run typecheck
```

> **Windows / OneDrive notu:** Proje OneDrive içindeyken `next build` bazen `Cannot read properties of null (reading 'useContext')` hatası verebilir. Bu, OneDrive'ın `node_modules` dosyalarını senkronize etmesinden kaynaklanır. Projeyi `C:\dev\aligstudio` gibi yerel bir klasöre taşıyıp yeniden `npm install` yapın ya da build sırasında OneDrive senkronizasyonunu duraklatın.

---

## 2. Vercel'e yükleme

### Adım 1 — Projeyi Git'e koy

Proje klasörünü bir GitHub deposuna yükleyin. `node_modules`, `.next` ve `.env` dosyaları `.gitignore` sayesinde dahil edilmez.

### Adım 2 — Vercel'de projeyi içe aktar

[vercel.com/new](https://vercel.com/new) → GitHub deposunu seç → **Deploy**.

Next.js otomatik algılanır; ekstra build ayarı gerekmez.

### Adım 3 — İçerik deposu (Vercel Blob)

Panelden yapılan değişikliklerin yayında kalıcı olması için:

1. Vercel projesi → **Storage** → **Create Database** → **Blob**.
2. Blob store'u projeye bağlayın.
3. `BLOB_READ_WRITE_TOKEN` ortam değişkeni otomatik eklenir.
4. **Redeploy** yapın.

Blob bağlı değilse panel yine açılır ancak kaydetme ve görsel yükleme çalışmaz; panel bunu kırmızı uyarıyla söyler.

### Adım 4 — Ortam değişkenleri

Vercel → **Settings** → **Environment Variables**:

| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `ADMIN_PASSWORD` | **Evet** | Panele giriş şifresi. Güçlü ve benzersiz olsun. |
| `ADMIN_SECRET` | **Şiddetle önerilir** | Oturum imzası için rastgele uzun anahtar (`openssl rand -base64 32`). Ayrıca gelen kutusundaki brief'lerin şifreleme anahtarıdır; bir kez tanımlayıp sabit bırakın (değiştirirseniz eski brief'ler okunamaz). |
| `ADMIN_PATH` | **Evet** | Gizli panel adresi. Örn: `/alig-9x4k2`. `/admin` kullanmayın. |
| `BLOB_READ_WRITE_TOKEN` | **Evet** | Blob store bağlanınca otomatik gelir. |
| `NEXT_PUBLIC_SITE_URL` | Evet | `https://www.aligstudio.com` |
| `RESEND_API_KEY` | Opsiyonel | İletişim formu e-postaları için. |
| `CONTACT_TO_EMAIL` | Opsiyonel | Form mesajlarının gideceği adres. |
| `CONTACT_FROM_EMAIL` | Opsiyonel | Resend'de doğrulanmış gönderen adresi. |

`ADMIN_PASSWORD` üretimde tanımlı değilse güvenlik gereği giriş tamamen kapanır.

`ADMIN_PATH` değerini değiştirdikten sonra **redeploy** gerekir. Panel adresini hiçbir yerde paylaşmayın, robots dosyasına veya menüye eklemeyin.

### Adım 5 — Giriş

`https://www.aligstudio.com` + `ADMIN_PATH` (ör. `https://www.aligstudio.com/alig-9x4k2`).

Panele girdikten sonra **Ctrl + S** ile de hızlı kaydedebilirsiniz.

---

## 3. Panelden neler düzenlenir?

| Sekme | İçerik |
|---|---|
| **Gelen Kutusu** | Brief formundan gelen mesajlar: okuma, cevaplama (e-posta), okundu işaretleme, tek tek veya toplu silme |
| **Marka & SEO** | Marka adı, logo yazısı/görseli, slogan, vurgu renkleri, site başlığı, açıklama, anahtar kelimeler, paylaşım görseli, üst menü |
| **Ana sayfa** | Hero başlığı, açıklama, butonlar, kontenjan yazısı, istatistikler, etiketler, kayan şerit |
| **Hizmetler** | Bölüm başlığı ve dört hizmet kartı (ikon, açıklama, etiketler) |
| **Çalışmalar** | Proje adı, kategori, yıl, açıklama, vaka detayı, etiketler, kapak görseli, dış bağlantı, poster rengi |
| **Stüdyo** | Hakkımızda metni, maddeler, istatistikler, süreç adımları |
| **YouTube** | Kanal bilgileri, kanal bağlantısı ve öne çıkan videolar (11 haneli YouTube ID veya doğrudan YouTube bağlantısı girilirse gerçek kapak görseli yüklenir) |
| **Referanslar** | Müşteri yorumları, kişi ve şirket bilgileri |
| **İletişim & Footer** | E-posta, telefon, WhatsApp, konum, form notu, sosyal medya bağlantıları, footer metinleri |

Her sekmede değişiklik yaptıktan sonra sağ üstteki **Yayınla** düğmesine basın. Kaydedilmemiş değişiklik varsa sayfadan ayrılırken tarayıcı uyarır.

Panelin sol altındaki **Yedek indir** bağlantısı mevcut içeriği JSON olarak indirir; **Yedek yükle** bağlantısı ile daha önce indirdiğiniz bir JSON yedeğini panele geri yükleyip **Yayınla** diyerek canlıya alabilirsiniz.

---

## 4. İletişim formu, brief gelen kutusu ve Resend

Formdan gönderilen her brief **her koşulda** panelin **Gelen Kutusu** bölümüne kaydedilir; mesaj hiçbir zaman kaybolmaz. Mesajlar depoda (yerelde `.data/inbox.json`, yayında Vercel Blob) **AES-256-GCM ile şifreli** saklanır; panelden okunabilir, okundu olarak işaretlenebilir ve silinebilir.

E-posta bildirimi isteğe bağlıdır ve Resend ile çalışır. `RESEND_API_KEY` tanımlıysa brief aynı zamanda e-posta olarak da gönderilir (gönderim başarısız olsa bile mesaj gelen kutunda durur). Ziyaretçiye her durumda "mesajın ulaştı" gösterilir.

E-posta bildirimini etkinleştirmek için:

1. [resend.com](https://resend.com) hesabı açın.
2. Gönderen alan adını doğrulayın (ör. `aligstudio.com`).
3. API key oluşturup Vercel'e `RESEND_API_KEY` olarak ekleyin.
4. `CONTACT_FROM_EMAIL` değerini doğrulanmış adresle güncelleyin (ör. `ALIG Studio <merhaba@aligstudio.com>`).
5. `CONTACT_TO_EMAIL` adresini kontrol edin.

---

## 5. Yayına geçmeden önce değiştirilmesi gerekenler

Bu proje, gerçekçi bir başlangıç içeriğiyle gelir. Yayına almadan önce panelden şunları kontrol edin:

- **Sosyal medya bağlantıları:** Instagram, YouTube, LinkedIn, Behance adresleri örnek olarak yazılmıştır.
- **Projeler ve referanslar:** Örnek marka ve yorumlardır. Kendi işlerinizle değiştirin veya silin.
- **Telefon / WhatsApp:** Boş bırakılmıştır; kullanmıyorsanız boş kalsın.
- **E-posta:** `merhaba@aligstudio.com` adresini kendi adresinizle doğrulayın.
- **Vaka detay metinleri:** Projelerin gerçek hikâyeleriyle güncelleyin.
- **Logo:** Hazırsa panelden PNG/WebP logo yükleyin; değilse yazı logo kullanılır.
- **Admin adresi ve şifre:** Varsayılan geliştirme değerlerini üretimde mutlaka değiştirin.

---

## 6. Proje yapısı

```text
aligstudio/
├─ app/
│  ├─ page.tsx                 # ana sayfa
│  ├─ calismalar/              # çalışmalar + vaka detay sayfaları
│  ├─ hizmetler/               # hizmetler sayfası
│  ├─ admin/                   # panel (yalnızca gizli yoldan rewrite edilir)
│  ├─ api/                     # giriş, içerik, görsel yükleme, iletişim
│  ├─ layout.tsx               # metadata, fontlar, renk değişkenleri
│  ├─ globals.css              # site tasarım sistemi
│  ├─ icon.tsx                 # dinamik favicon
│  └─ opengraph-image.tsx      # dinamik sosyal paylaşım görseli
├─ components/                 # site bileşenleri
├─ content/site.json           # başlangıç içeriği (varsayılanlar)
├─ lib/
│  ├─ content.ts               # içerik okuma/kaydetme
│  ├─ storage.ts               # Vercel Blob / yerel dosya deposu
│  ├─ auth.ts                  # imzalı oturum çerezi
│  ├─ admin-schema.ts          # panel form şeması
│  └─ types.ts                 # içerik tipleri
├─ middleware.ts               # gizli panel yolu + /admin koruması
├─ pnpm-workspace.yaml         # PostCSS güvenlik güncellemesi (override)
├─ SECURITY.md                 # güvenlik değerlendirmesi ve kalan riskler
└─ .env.example                # ortam değişkenleri örneği
```

İçerik varsayılanları `content/site.json` dosyasındadır. Panelden ilk kayıt yapıldığında bu dosya değişmez; yeni içerik Blob'da (yayında) veya `.data/content.json` dosyasında (yerelde) saklanır. `content/site.json` yalnızca yedek/varsayılan görevi görür.

---

## 7. Güvenlik notları

- Panel şifresi ve `ADMIN_SECRET` yalnızca Vercel ortam değişkenlerinde tutulur; kodda gerçek şifre yoktur.
- Oturum çerezi `httpOnly`, `sameSite=lax` ve üretimde `secure` olarak işaretlenir; 7 gün geçerlidir.
- Giriş denemeleri IP başına sınırlandırılır.
- Doğrudan `/admin` adresi 404 döner. Panel yalnızca `ADMIN_PATH` ile açılır ve arama motorlarına `noindex` başlığı gönderilir.
- Yüklenen görseller yalnızca JPG, PNG, WebP, GIF, AVIF olabilir ve 4 MB ile sınırlıdır.
- Vercel Blob içeriği teknik olarak public URL ile okunabilir; bu dosyada şifre/anahtar tutulmaz. Gizli bilgi saklamayın.
- JSON-LD, bağlantı şemaları ve içerik çıktıları XSS'e karşı kaçışlanır/filtrelenir.
- **Üretimde `ADMIN_PASSWORD` zorunludur.** Tanımlı değilse giriş tamamen kapalıdır; kodda bilinen varsayılan şifre veya sabit oturum anahtarı **kullanılmaz** (eski sürümlerdeki geliştirme yedeği üretimde de devreye giriyordu — bu kapatıldı).
- **Gelen kutusu şifrelidir.** Brief'ler AES-256-GCM ile şifrelenerek saklanır; Blob URL'lerini bilen biri mesajları okuyamaz. Şifreleme anahtarı `ADMIN_SECRET`'tan türetilir.

Ayrıntılı değerlendirme, kalan riskler ve yayın öncesi kontrol listesi: **[SECURITY.md](./SECURITY.md)**

---

## 8. Faydalı notlar

- **Renk değişimi:** Marka sekmesindeki vurgu rengi tüm siteye (butonlar, çizgiler, orb, marquee) otomatik uygulanır. Açık tonlar koyu zeminde daha iyi okunur.
- **Görsel yükleme:** Blob bağlı değilken yükleme çalışmaz. Yerelde `public/uploads` klasörüne yazılır.
- **YouTube:** Video ID'si girilmezse otomatik gradyan kapak gösterilir. ID girilince `i.ytimg.com` üzerinden gerçek kapak yüklenir.
- **Dış bağlantı:** Bir projeye `https://...` bağlantısı eklerseniz vaka sayfasında "Projeyi gör" butonu çıkar.
- **SEO:** Başlık ve açıklama panelden değiştirilir; canonical, sitemap ve JSON-LD otomatik güncellenir.
- **Güvenlik güncellemesi:** Bağımlılık taraması `pnpm audit --prod` ile yapılabilir. Bu sürümde PostCSS için `pnpm-workspace.yaml` override'ı uygulanmıştır.
