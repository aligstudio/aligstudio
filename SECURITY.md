# Güvenlik değerlendirmesi

**Son gözden geçirme:** 26 Ekim 2026  
**Kapsam:** ALIG Studio web sitesi + içerik paneli (`aligstudio`)

## Kısa cevap

Uygulamada kimlik doğrulaması olmadan uzaktan sömürülebilecek **kritik bir açık tespit edilmedi**. Panel, gizli adres + şifre + imzalı oturum çerezi ile korunuyor; formlar ve içerik çıktıları React tarafından kaçışlanıyor.

Ancak **"güvenli" demek için tek başına kod yetmez**. En büyük risk panel şifresinin zayıf olması veya sızmasıdır. Panelde **iki faktörlü doğrulama (2FA) yok**; bu, yayın öncesi değerlendirilmesi gereken en önemli eksik.

Bağımlılık taraması (`pnpm audit --prod`) bu sürümde **temiz**. Next.js'in getirdiği eski PostCSS sürümü, `pnpm-workspace.yaml` içindeki override ile güncellendi.

## Bu sürümde giderilen kritik bulgular (26 Ekim 2026)

1. **Kritik — üretimde bilinen varsayılan kimlik bilgileri (giderildi).** Eski sürümde `ADMIN_PASSWORD` tanımlı değilse giriş şifresi tüm ortamlarda `aligstudio`'ya düşüyor ve oturum çerezi kodda yazılı sabit bir anahtarla (`alig-studio-development-secret-change-me`) imzalanıyordu. Bu, üretimde (a) bilinen şifreyle giriş ve (b) bilinen anahtarla **çevrimdışı sahte oturum çerezi üretilerek şifresiz tam panel erişimi** anlamına geliyordu. Artık üretimde (`NODE_ENV=production` / Vercel) bu yedekler devre dışıdır: `ADMIN_PASSWORD` yoksa girişi kapalıdır, çerez imzalanmaz ve panel adresi 404 döner. (Bu davranış README/SECURITY.md'de önceden vaat ediliyor ama kodda uygulanmıyordu — belge ile kod artık uyumlu.)
2. **Yüksek — iletişim mesajlarının kaybolması / kişisel veri ifşası (giderildi).** Form mesajları `RESEND_API_KEY` yoksa tamamen kayboluyordu. Artık her brief panelin **Gelen Kutusu**'na kaydedilir ve Vercel Blob public URL yapısı gereği üçüncü kişilerin okuyamaması için **AES-256-GCM ile şifrelenerek** saklanır (anahtar `ADMIN_SECRET`'tan türetilir; sabit tutulmalıdır).

---

## 1. Panel erişimi nasıl korunuyor?

- **Varsayılan `/admin` yolu kapalı.** Doğrudan `/admin` isteği 404 döner. Panel yalnızca `ADMIN_PATH` ortam değişkenindeki gizli adresten açılır.
- **Gizli adres tek başına güvenlik değildir.** Asıl koruma şifredir; adres yalnızca görünürlüğü azaltır.
- **Şifre üretimde zorunlu.** `ADMIN_PASSWORD` tanımlı değilse üretimde giriş tamamen kapalıdır; kodda varsayılan üretim şifresi yoktur.
- **Eksik yapılandırma koruması:** Vercel'de `ADMIN_PASSWORD` ve `ADMIN_SECRET` yoksa panel adresi 404 döner; bilinen geliştirme anahtarıyla çerez uydurulup oturum açılamaz.
- **Oturum çerezi:** HMAC-SHA256 imzalı, `httpOnly`, üretimde `secure`, `sameSite=lax`, 7 gün geçerli.
- **Şifre karşılaştırması:** Hem girilen hem de beklenen şifre SHA-256 ile sabit 32 baytlık özete dönüştürülüp `timingSafeEqual` ile karşılaştırılır; şifre uzunluğu yan kanaldan sızmaz.
- **Sırlar istek başlığına yazılmaz:** Middleware, doğrudan `/admin` isteklerini engellerken `ADMIN_PASSWORD` veya `ADMIN_SECRET` değerlerini hiçbir HTTP başlığına (`x-alig-admin-entry` vb.) eklemez.
- **Giriş denemesi sınırı:** IP başına 10 dakikada 10 deneme. Bu sınır sunucu örneği başına bellekte tutulur; dağıtık saldırıda tek başına yeterli değildir.
- **API koruması:** İçerik okuma/yazma, görsel yükleme ve oturum kontrolü çerez ister; tüm durum değiştiren (`POST`/`PUT`) uçlarda zorunlu `Origin`/`Referer` + `Sec-Fetch-Site` + `x-forwarded-host` kontrolü (`isSameOrigin`) uygulanır.
- **CSRF:** `sameSite=lax` + zorunlu `Origin`/`Referer` doğrulaması birlikte kullanılır; başlıksız çapraz kaynak istekleri reddedilir.

---

## 2. Uygulanan sertleştirmeler

- **Güvenlik başlıkları:** `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS, `Cross-Origin-Opener-Policy` ve `frame-ancestors 'none'` içeren kısmi CSP.
- **JSON-LD kaçışlama:** Panelden girilen metinlerin `</script>` ile JSON-LD bloğundan çıkması engellenir. Bu senaryo uçtan uca test edildi.
- **Bağlantı ve görsel şeması filtresi:** Menü, sosyal medya, CTA ve WhatsApp bağlantılarında yalnızca `http(s)`, `mailto`, `tel`, `#` ve kök-relative yollar kabul edilir; görsel URL'lerinde (`safeImageSrc`) yalnızca `https://`, `http://` ve `/...` yollarına izin verilir (`javascript:`, `data:` reddedilir).
- **İçerik normalizasyonu:** Vurgu renkleri hex olarak doğrulanır; çalışma renkleri normalize edilir; YouTube alanlarına tam URL yapıştırılsa bile güvenli 11 karakterlik video ID'si ayıklanır.
- **Görsel yükleme (Magic-Byte doğrulaması):** Yalnızca JPG, PNG, WebP, GIF, AVIF; en fazla 4 MB. İstemcinin gönderdiği `Content-Type` veya dosya uzantısına güvenilmez; dosyanın ilk baytları (magic bytes) sunucuda doğrulanır ve uzantı tespit edilen gerçek formata göre atanır.
- **İletişim formu:** Honeypot, IP bazlı hız sınırı, e-posta doğrulaması, HTML kaçışlama ve başlık satırı temizliği.
- **Sırlar istemciye gitmez:** `ADMIN_PASSWORD`, `ADMIN_SECRET`, Blob token'ı yalnızca sunucudadır. `X-Powered-By` kapatılmıştır.
- **Yönetici sayfası:** `noindex, nofollow, noarchive` ve `Cache-Control: no-store`.
- **Bağımlılık taraması:** PostCSS override sonrası bilinen üretim bağımlılığı açığı yok.

---

## 3. Kalan riskler ve sınırlamalar

| Konu | Seviye | Durum / öneri |
|---|---|---|
| Şifre + 2FA yok | **Yüksek (şifre sızarsa)** | 20+ karakter, benzersiz, parola yöneticisinde saklanan bir şifre kullanın. 2FA eklemek isterseniz TOTP (authenticator) sonraki adım olabilir. |
| Dağıtık kaba kuvvet | Orta | Hız sınırı bellek tabanlı. Kritik görürseniz Upstash Redis tabanlı limit veya Cloudflare Turnstile ekleyin. |
| Oturum iptali | Orta | Çıkış çerezi siler; çalınmış bir çerez 7 gün geçerli kalabilir. Şüphede `ADMIN_SECRET` değiştirip yeniden deploy edin (tüm oturumlar geçersiz olur). |
| Gizli panel adresi | Düşük/Orta | Gizlilik, güvenlik değildir. Adres tarayıcı geçmişi, ekran paylaşımı veya loglarla görülebilir. Şifre güçlü olmalı. |
| İçerik yöneticisi | Düşük | Paneli ele geçiren kişi site içeriğini değiştirebilir; bu panelin doğası. 2FA ve güçlü şifre bu riski azaltır. |
| Vercel Blob | Düşük | İçerik ve görseller public URL ile okunabilir; **buraya şifre/anahtar koymayın**. Blob token'ı yalnızca sunucuda. Brief gelen kutusu AES-256-GCM ile şifreli saklanır. |
| İletişim formu spam'i | Orta | Honeypot + limit var. Resend kotanızı kötüye kullanmak isteyen biri için Turnstile/CAPTCHA eklenebilir. |
| Kısmi CSP | Düşük | Next.js inline runtime nedeniyle tam `script-src` CSP eklenmedi. Nonce tabanlı CSP ileri seviye sertleştirme olarak eklenebilir. |
| OneDrive ve `.env` | Orta | Üretim sırlarını OneDrive/Desktop içindeki `.env` dosyasına koymayın; Vercel ortam değişkenlerini kullanın. Yerel `.env.local` yalnızca geliştirme içindir. |
| Preview deployment'ları | Orta | Vercel preview URL'leri herkese açık olabilir. Vercel Authentication / Deployment Protection açın. |
| Bağımlılık yaşlanması | Düşük | Her güncellemede `pnpm audit --prod` ve `pnpm build` çalıştırın. |

---

## 4. Yayına almadan önce kontrol listesi

- [ ] `ADMIN_PASSWORD` 20+ karakter, benzersiz ve parola yöneticisinde
- [ ] `ADMIN_SECRET` rastgele ve uzun (`openssl rand -base64 32`)
- [ ] `ADMIN_PATH` tahmin edilmesi zor, `/admin` dışında bir yol
- [ ] `.env` / `.env.local` Git'e veya halka açık bir klasöre kopyalanmadı
- [ ] Vercel'de yalnızca gerekli ortam değişkenleri tanımlı
- [ ] Blob store projeye bağlı ve `BLOB_READ_WRITE_TOKEN` ayarlı
- [ ] Vercel preview deployment koruması açık
- [ ] Resend alan adı doğrulandı; `CONTACT_FROM_EMAIL` ve kotası kontrol edildi
- [ ] Panelde giriş, çıkış, görsel yükleme, kaydetme ve geri alma test edildi
- [ ] İçerik yedeği indirildi
- [ ] `pnpm audit --prod` temiz
- [ ] İsteğe bağlı: 2FA / Turnstile / dağıtık rate limit

---

## 5. Olay müdahalesi

Panel şifresinin sızdığını düşünüyorsanız:

1. Vercel'de `ADMIN_PASSWORD` ve `ADMIN_SECRET` değerlerini değiştirin.
2. Yeniden deploy edin — `ADMIN_SECRET` değişince eski oturum çerezleri geçersiz olur.
3. Gerekirse `ADMIN_PASSWORD` değişkenini geçici olarak **silin**; üretimde giriş tamamen kapanır.
4. Vercel loglarında şüpheli `/api/admin/*` isteklerini inceleyin.
5. Şüpheli görsel veya içerik varsa Blob store'dan kaldırın; içeriği panel yedeğinden geri yükleyin.
6. Blob token'ı veya Resend API anahtarı sızdıysa ilgili anahtarları döndürün.

---

## 6. Not

Bu doküman proje düzeyinde bir güvenlik incelemesidir; resmî bir sızma testi (pentest) değildir. Yüksek trafikli veya hassas veri içeren bir yapıya dönüşürse bağımsız bir güvenlik testi yaptırmanız önerilir.
