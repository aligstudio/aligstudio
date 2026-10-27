import type { SiteContent } from '@/lib/types';
import { safeHref } from '@/lib/utils';
import { ContactForm } from '../ContactForm';
import { Icon, socialIcon } from '../icons';

export function Contact({
  contact,
  social
}: {
  contact: SiteContent['contact'];
  social: SiteContent['social'];
}) {
  return (
    <section className="section contact" id="iletisim">
      <div className="container">
        <div className="contact__layout">
          <div className="contact__copy">
            <div className="contact__eyebrow-row" data-reveal>
              <p className="eyebrow">
                <i aria-hidden="true" /> {contact.eyebrow}
              </p>
              {contact.responseBadge ? (
                <span className="contact__response-badge">
                  <span className="status-dot" aria-hidden="true" />
                  {contact.responseBadge}
                </span>
              ) : null}
            </div>

            <h2 className="contact__title" data-reveal>
              {contact.title}
            </h2>
            <p className="contact__desc" data-reveal>
              {contact.description}
            </p>

            <a
              href={safeHref(`mailto:${contact.email}`, '#')}
              className="contact__mail"
              data-reveal
            >
              <span>{contact.email}</span>
              <span className="contact__mail-icon">
                <Icon name="arrowUpRight" size={22} />
              </span>
            </a>

            <div className="contact__details" data-reveal>
              <div>
                <span className="contact__label">Konum</span>
                <span className="contact__value">
                  <Icon name="pin" size={15} /> {contact.location}
                </span>
              </div>
              {contact.phone ? (
                <div>
                  <span className="contact__label">Telefon</span>
                  <a
                    className="contact__value"
                    href={safeHref(`tel:${contact.phone.replace(/\s/g, '')}`, '#')}
                  >
                    <Icon name="phone" size={15} /> {contact.phone}
                  </a>
                </div>
              ) : null}
              {contact.whatsapp ? (
                <div>
                  <span className="contact__label">WhatsApp</span>
                  <a
                    className="contact__value"
                    href={safeHref(contact.whatsapp, '#')}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="whatsapp" size={15} /> WhatsApp
                  </a>
                </div>
              ) : null}
            </div>

            <div className="contact__socials" data-reveal>
              {social
                .filter((item) => item.url)
                .map((item) => (
                  <a
                    key={`${item.platform}-${item.url}`}
                    href={safeHref(item.url, '#')}
                    target="_blank"
                    rel="noreferrer"
                    className="contact__social"
                    aria-label={item.platform}
                  >
                    <Icon name={socialIcon(item.platform)} size={17} />
                    <span>{item.platform}</span>
                  </a>
                ))}
            </div>
          </div>

          <div className="contact__form-wrap" data-reveal>
            <ContactForm contact={contact} />
          </div>
        </div>
      </div>
    </section>
  );
}
