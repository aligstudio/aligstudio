'use client';

import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/icons';
import type { SiteContent } from '@/lib/types';

export function AdminLogin({ brand }: { brand: SiteContent['brand'] }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password || loading) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (response.ok && result.ok) {
        window.location.reload();
        return;
      }

      setError(result.message || 'Giriş yapılamadı. Tekrar dene.');
      setLoading(false);
    } catch {
      setError('Bağlantı kurulamadı. Tekrar dene.');
      setLoading(false);
    }
  }

  return (
    <main className="login">
      <section className="login__showcase">
        <div className="login__brand">
          {brand.logoImage ? (
            <img src={brand.logoImage} alt={brand.name} />
          ) : (
            <span className="login__mark">
              <Icon name="spark" size={18} strokeWidth={1.9} />
            </span>
          )}
          <span>
            <strong>{brand.logoText}</strong>
            <small lang="en">
              {(brand.name.replace(brand.logoText, '').trim() || 'Studio').toLocaleUpperCase(
                'en-US'
              )}
            </small>
          </span>
        </div>

        <div className="login__hero">
          <span className="login__eyebrow" lang="en">
            STUDIO PANEL — PRIVATE ACCESS
          </span>
          <h1>
            Kontrol <em>sende.</em>
          </h1>
          <p>
            Logo, başlıklar, projeler, videolar, referanslar ve tüm site metinleri tek bir
            panelden. Değiştir, önizle, yayınla.
          </p>
        </div>

        <div className="login__foot">
          <span className="status-dot" aria-hidden="true" />
          <span>Yalnızca yetkili stüdyo erişimi</span>
          <span className="login__foot-sep" aria-hidden="true" />
          <span>İstanbul</span>
        </div>

        <div className="login__glow" aria-hidden="true" />
        <div className="login__grid" aria-hidden="true" />
      </section>

      <section className="login__form-wrap">
        <form className="login__form" onSubmit={handleSubmit}>
          <span className="login__lock">
            <Icon name="lock" size={22} />
          </span>
          <span className="login__kicker">Güvenli giriş</span>
          <h2>Stüdyo paneline giriş</h2>
          <p className="login__lead">Devam etmek için panel şifreni gir.</p>

          <label className="login__field">
            <span>Şifre</span>
            <div className="login__input-wrap">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                autoFocus
                placeholder="Panel şifren"
              />
              <button
                type="button"
                onClick={() => setShow((value) => !value)}
                aria-label={show ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                <Icon name={show ? 'eyeOff' : 'eye'} size={17} />
              </button>
            </div>
          </label>

          {error ? (
            <p className="login__error" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="admin-btn admin-btn--primary login__submit"
            disabled={loading || !password}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş yap'}
            <Icon name="arrowRight" size={17} />
          </button>

          <p className="login__note">
            Bu sayfa arama motorlarına kapalıdır ve yalnızca gizli panel adresinden açılır.
            Şifreni kimseyle paylaşma.
          </p>
        </form>
      </section>
    </main>
  );
}
