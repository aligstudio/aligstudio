'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'alig-cookie-consent';

/**
 * Cookie notice. The site uses strictly necessary cookies only, so the banner
 * is an acknowledgement ("Kabul Et") — there is no reject option because no
 * optional/tracking cookies exist to reject. Each acceptance is logged to the
 * admin panel (see /api/consent) without any personal data.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) !== 'accepted') {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = async () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {
      /* özel modda localStorage olmayabilir */
    }
    try {
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: window.location.pathname })
      });
    } catch {
      /* kayıt başarısız olsa da banner kapanır */
    }
  };

  if (!visible) return null;

  return (
    <div className="cookie-bar" role="region" aria-label="Çerez bilgilendirmesi">
      <div className="cookie-bar__inner">
        <div className="cookie-bar__text">
          <strong>🍪 Yalnızca zorunlu çerezler</strong>
          <p>
            Bu site, çalışması için gerekli olan zorunlu çerezleri kullanır; takip
            veya reklam çerezi bulunmaz. Ayrıntılar{' '}
            <Link href="/gizlilik">Gizlilik &amp; Çerez Politikası</Link>&rsquo;nda.
          </p>
        </div>
        <button type="button" className="btn btn--accent cookie-bar__btn" onClick={accept}>
          Kabul Et
        </button>
      </div>
    </div>
  );
}
