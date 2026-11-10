'use client';

import { useState, type FormEvent } from 'react';
import type { SiteContent } from '@/lib/types';
import { Icon } from './icons';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm({ contact }: { contact: SiteContent['contact'] }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [warn, setWarn] = useState('');

  const topics =
    Array.isArray(contact.topics) && contact.topics.length > 0
      ? contact.topics
      : [
          'Sosyal medya yönetimi',
          'Reklam & prodüksiyon',
          'Yazılım / web projesi',
          'YouTube içerik üretimi',
          'Diğer'
        ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || ''),
      email: String(data.get('email') || ''),
      company: String(data.get('company') || ''),
      topic: String(data.get('topic') || ''),
      message: String(data.get('message') || ''),
      website: String(data.get('website') || '')
    };

    setStatus('sending');
    setError('');
    setWarn('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
        stored?: boolean;
      };

      if (response.ok && result.ok) {
        setStatus('sent');
        setWarn(
          result.stored === false
            ? 'Mesajın e-posta ile ulaştı; panel kaydı şu an yapılamadı, kısa süre sonra tekrar dener misin?'
            : ''
        );
        form.reset();
        return;
      }

      setStatus('error');
      setError(result.message || contact.errorGeneric || 'Mesaj gönderilemedi. Lütfen tekrar dene.');
    } catch {
      setStatus('error');
      setError(contact.errorNetwork || 'Bağlantı kurulamadı. İnternetini kontrol edip tekrar dene.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="contact-form contact-form--state" role="status">
        <span className="contact-form__state-icon">
          <Icon name="check" size={26} />
        </span>
        <h3>{contact.successTitle || 'Mesajın bize ulaştı.'}</h3>
        <p>
          {contact.successMessage ||
            '24 saat içinde dönüş yapacağız. Bu arada işlerimize göz atabilirsin.'}
        </p>
        {warn ? (
          <p className="contact-form__error" role="alert">
            {warn}
          </p>
        ) : null}
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStatus('idle')}>
          {contact.newMessageLabel || 'Yeni mesaj yaz'}
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__head">
        <span className="contact-form__label">{contact.formTitle || 'Brief formu'}</span>
        <span className="contact-form__note">{contact.formNote}</span>
      </div>

      <div className="contact-form__row">
        <label className="field">
          <span>{contact.nameLabel || 'Ad Soyad'}</span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={contact.namePlaceholder || 'Adın Soyadın'}
          />
        </label>
        <label className="field">
          <span>{contact.emailLabel || 'E-posta'}</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={contact.emailPlaceholder || 'ornek@marka.com'}
          />
        </label>
      </div>

      <div className="contact-form__row">
        <label className="field">
          <span>{contact.companyLabel || 'Marka / Şirket'}</span>
          <input
            name="company"
            type="text"
            autoComplete="organization"
            placeholder={contact.companyPlaceholder || 'Marka adı (opsiyonel)'}
          />
        </label>
        <label className="field">
          <span>{contact.topicLabel || 'Konu'}</span>
          <select name="topic" defaultValue={topics[0]}>
            {topics.map((topic, index) => (
              <option key={`${topic}-${index}`} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span>{contact.messageLabel || 'Proje notu'}</span>
        <textarea
          name="message"
          rows={5}
          required
          minLength={10}
          placeholder={
            contact.messagePlaceholder ||
            'Hedefini, takvimini veya aklındaki fikri kısaca anlat...'
          }
        />
      </label>

      <label className="contact-form__honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      {status === 'error' ? (
        <p className="contact-form__error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="contact-form__foot">
        <button type="submit" className="btn btn--accent" disabled={status === 'sending'}>
          {status === 'sending'
            ? contact.sendingLabel || 'Gönderiliyor...'
            : contact.submitLabel || 'Brief’i gönder'}
          <Icon name="arrowUpRight" size={16} />
        </button>
        <p>
          {contact.privacyNote ||
            'Bilgilerin yalnızca sana dönüş yapmak için kullanılır.'}
        </p>
      </div>
    </form>
  );
}
