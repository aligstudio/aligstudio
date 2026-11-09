'use client';

import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import defaultSiteJson from '@/content/site.json';
import { Icon } from '@/components/icons';
import { ADMIN_TABS, THEME_PRESETS, type ThemePreset } from '@/lib/admin-schema';
import type { SiteContent, StorageMode } from '@/lib/types';
import { contrastInk, deepMerge, isPlainObject } from '@/lib/utils';
import { FieldRenderer } from './fields';
import { ConsentView } from './ConsentView';
import { InboxView } from './InboxView';

type Toast = { type: 'success' | 'error'; text: string };

const factoryDefaults = defaultSiteJson as unknown as SiteContent;

function getByPath(object: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((accumulator, key) => {
    if (accumulator && typeof accumulator === 'object') {
      return (accumulator as Record<string, unknown>)[key];
    }
    return undefined;
  }, object);
}

function setByPath<T>(object: T, path: string, value: unknown): T {
  const clone = structuredClone(object) as Record<string, unknown>;
  const keys = path.split('.');
  let cursor: Record<string, unknown> = clone;
  keys.slice(0, -1).forEach((key) => {
    const next = cursor[key];
    if (!next || typeof next !== 'object' || Array.isArray(next)) {
      cursor[key] = {};
    }
    cursor = cursor[key] as Record<string, unknown>;
  });
  cursor[keys[keys.length - 1]] = value;
  return clone as T;
}

const INBOX_TAB_ID = 'inbox';
const CONSENT_TAB_ID = 'consent';
const INBOX_META = {
  title: 'Gelen Kutusu',
  description: 'Brief formundan gelen mesajları oku, cevapla ve yönet.'
};

const STORAGE_LABELS: Record<StorageMode, { label: string; tone: string }> = {
  blob: { label: 'Vercel Blob bağlı', tone: 'ok' },
  github: { label: 'GitHub deposu bağlı', tone: 'ok' },
  local: { label: 'Yerel geliştirme', tone: 'warn' },
  locked: { label: 'Depolama bağlı değil', tone: 'error' }
};

export function AdminApp({
  initialContent,
  storageMode
}: {
  initialContent: SiteContent;
  storageMode: StorageMode;
}) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [savedContent, setSavedContent] = useState<SiteContent>(initialContent);
  const [tabId, setTabId] = useState(ADMIN_TABS[0].id);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [inboxUnread, setInboxUnread] = useState(0);

  const dirty = useMemo(
    () => JSON.stringify(content) !== JSON.stringify(savedContent),
    [content, savedContent]
  );

  const dirtyTabs = useMemo(() => {
    const set = new Set<string>();
    for (const item of ADMIN_TABS) {
      const hasDiff = item.groups.some((group) =>
        group.fields.some(
          (field) =>
            JSON.stringify(getByPath(content, field.key)) !==
            JSON.stringify(getByPath(savedContent, field.key))
        )
      );
      if (hasDiff) set.add(item.id);
    }
    return set;
  }, [content, savedContent]);

  const tab = ADMIN_TABS.find((item) => item.id === tabId) ?? ADMIN_TABS[0];
  const isInbox = tabId === INBOX_TAB_ID;
  const isConsent = tabId === CONSENT_TAB_ID;

  useEffect(() => {
    const stored = window.localStorage.getItem('alig-admin-tab');
    if (
      stored &&
      (stored === INBOX_TAB_ID ||
        stored === CONSENT_TAB_ID ||
        ADMIN_TABS.some((item) => item.id === stored))
    ) {
      setTabId(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('alig-admin-tab', tabId);
  }, [tabId]);

  // Unread brief badge (best-effort, refreshed on load and inbox actions).
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch('/api/admin/inbox', { cache: 'no-store' });
        const result = (await response.json().catch(() => ({}))) as { ok?: boolean; unread?: number };
        if (!cancelled && response.ok && result.ok && typeof result.unread === 'number') {
          setInboxUnread(result.unread);
        }
      } catch {
        // Rozet kritik değil; sessiz geç.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const save = useCallback(async () => {
    if (saving || !dirty || storageMode === 'locked') return;
    setSaving(true);
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        content?: SiteContent;
        message?: string;
      };

      if (response.status === 401) {
        setToast({
          type: 'error',
          text: 'Oturum sona erdi. Sayfayı yenileyip tekrar giriş yap.'
        });
        return;
      }

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'İçerik kaydedilemedi.');
      }

      const nextContent = result.content ?? content;
      setContent(nextContent);
      setSavedContent(nextContent);
      setLastSaved(new Date());
      setToast({ type: 'success', text: 'Değişiklikler yayınlandı.' });
    } catch (error) {
      setToast({
        type: 'error',
        text: error instanceof Error ? error.message : 'İçerik kaydedilemedi.'
      });
    } finally {
      setSaving(false);
    }
  }, [content, dirty, saving, storageMode]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void save();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [save]);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      window.location.reload();
    }
  }

  function applyThemePreset(preset: ThemePreset) {
    setContent((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        ...preset.colors
      }
    }));
    setToast({
      type: 'success',
      text: `"${preset.name}" tema paleti uygulandı. Kaydetmek için Yayınla düğmesine bas.`
    });
  }

  function resetToFactoryDefaults() {
    if (
      !window.confirm(
        'Tüm site renkleri ve metinleri fabrika varsayılanlarına döndürülsün mü? (Yayınla düğmesine basana kadar kalıcı olmaz.)'
      )
    ) {
      return;
    }
    setContent(structuredClone(factoryDefaults));
    setToast({
      type: 'success',
      text: 'Varsayılan içerik yüklendi. Kalıcı olması için Yayınla düğmesine bas.'
    });
  }

  function downloadBackup() {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aligstudio-icerik.json';
    link.click();
    URL.revokeObjectURL(url);
    setToast({ type: 'success', text: 'İçerik yedeği indirildi.' });
  }

  async function importBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      if (!isPlainObject(parsed)) {
        throw new Error('Geçersiz yedek dosyası.');
      }
      const merged = deepMerge(savedContent, parsed);
      setContent(merged);
      setToast({
        type: 'success',
        text: 'Yedek yüklendi. Sitede görünmesi için Yayınla düğmesine bas.'
      });
    } catch {
      setToast({
        type: 'error',
        text: 'Yedek dosyası okunamadı. Geçerli bir JSON dosyası seç.'
      });
    }
  }

  const storage = STORAGE_LABELS[storageMode];
  const isPresetActive = (preset: ThemePreset) =>
    content.brand.bg?.toUpperCase() === preset.colors.bg.toUpperCase() &&
    content.brand.accent?.toUpperCase() === preset.colors.accent.toUpperCase() &&
    content.brand.ink?.toUpperCase() === preset.colors.ink.toUpperCase();

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-side__brand">
          {content.brand.logoImage ? (
            <img className="admin-side__logo" src={content.brand.logoImage} alt={content.brand.name} />
          ) : (
            <span className="admin-side__mark">
              <Icon name="spark" size={17} strokeWidth={1.9} />
            </span>
          )}
          <span className="admin-side__brand-text">
            <strong>{content.brand.logoText}</strong>
            <small lang="en">STUDIO CMS</small>
          </span>
        </div>

        <div className={`admin-storage admin-storage--${storage.tone}`}>
          <i aria-hidden="true" />
          {storage.label}
        </div>

        <nav className="admin-nav" aria-label="Panel bölümleri">
          <button
            type="button"
            className={`admin-nav__item ${isInbox ? 'is-active' : ''}`}
            onClick={() => setTabId(INBOX_TAB_ID)}
          >
            <span className="admin-nav__icon">
              <Icon name="mail" size={17} />
            </span>
            <span>Gelen Kutusu</span>
            {inboxUnread > 0 ? (
              <span className="admin-nav__badge">{inboxUnread > 99 ? '99+' : inboxUnread}</span>
            ) : (
              <span className="admin-nav__num">—</span>
            )}
          </button>
          <button
            type="button"
            className={`admin-nav__item ${isConsent ? 'is-active' : ''}`}
            onClick={() => setTabId(CONSENT_TAB_ID)}
          >
            <span className="admin-nav__icon">
              <Icon name="lock" size={17} />
            </span>
            <span>Çerez Onayları</span>
            <span className="admin-nav__num">—</span>
          </button>
          <span className="admin-nav__divider">İçerik</span>
          {ADMIN_TABS.map((item, index) => {
            const tabDirty = dirtyTabs.has(item.id);
            return (
              <button
                key={item.id}
                type="button"
                className={item.id === tabId ? 'is-active' : undefined}
                onClick={() => setTabId(item.id)}
              >
                <span className="admin-nav__icon">
                  <Icon name={item.icon} size={17} />
                </span>
                <span>{item.label}</span>
                <span className="admin-nav__num">
                  {tabDirty ? <i className="admin-nav__dot" title="Değişiklik var" /> : null}
                  {String(index + 1).padStart(2, '0')}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="admin-side__foot">
          <a href="/" target="_blank" rel="noreferrer" className="admin-side__link">
            <Icon name="monitor" size={16} /> Siteyi görüntüle
            <Icon name="external" size={12} />
          </a>
          <button type="button" className="admin-side__link" onClick={downloadBackup}>
            <Icon name="download" size={16} /> Yedek indir (.json)
          </button>
          <label className="admin-side__link admin-side__upload">
            <Icon name="upload" size={16} /> Yedek yükle (.json)
            <input
              type="file"
              accept="application/json,.json"
              onChange={(event) => void importBackup(event)}
            />
          </label>
          <button type="button" className="admin-side__link" onClick={resetToFactoryDefaults}>
            <Icon name="layers" size={16} /> Varsayılanları yükle
          </button>
          <button
            type="button"
            className="admin-side__link"
            onClick={logout}
            disabled={loggingOut}
          >
            <Icon name="logout" size={16} /> {loggingOut ? 'Çıkılıyor...' : 'Çıkış yap'}
          </button>
          <p className="admin-side__hint">
            <Icon name="lock" size={12} /> Panel adresi gizli tutuluyor.
          </p>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-top">
          <div className="admin-top__copy">
            <span className="admin-top__kicker">
              {isInbox ? 'Brief Merkezi' : isConsent ? 'Ziyaretçi Onayları' : 'Tam CMS & Tema Motoru'}
            </span>
            <h1>{isInbox ? INBOX_META.title : isConsent ? 'Çerez Onayları' : tab.title}</h1>
            <p>
              {isInbox
                ? INBOX_META.description
                : isConsent
                  ? 'Zorunlu çerez bildirimi onaylarının kayıtları ve özeti.'
                  : tab.description}
            </p>
          </div>
          <div className="admin-top__actions">
            {!isInbox ? (
              <>
                <span className={`admin-dirty ${dirty ? 'is-dirty' : ''}`}>
                  {dirty ? 'Kaydedilmemiş değişiklik' : lastSaved ? 'Yayında' : 'Güncel'}
                </span>
                {dirty ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    onClick={() => setContent(savedContent)}
                    disabled={saving}
                  >
                    Geri al
                  </button>
                ) : null}
                <button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  onClick={() => void save()}
                  disabled={!dirty || saving || storageMode === 'locked'}
                  title={storageMode === 'locked' ? 'Önce Vercel Blob bağlanmalı' : undefined}
                >
                  {saving ? 'Kaydediliyor...' : 'Yayınla'}
                  <Icon name="check" size={15} />
                </button>
              </>
            ) : null}
          </div>
        </header>

        <div className="admin-content">
          {storageMode === 'locked' ? (
            <div className="admin-banner admin-banner--error">
              <Icon name="bolt" size={18} />
              <div>
                <strong>İçerik deposu bağlı değil</strong>
                <p>
                  Vercel panelinde <b>Storage → Blob</b> oluşturup projeye bağla.{' '}
                  <code>BLOB_READ_WRITE_TOKEN</code> otomatik eklenir; ardından yeniden deploy
                  et. O zamana kadar değişiklikler kaydedilemez.
                </p>
              </div>
              <a
                href="https://vercel.com/docs/storage/vercel-blob"
                target="_blank"
                rel="noreferrer"
                className="admin-banner__link"
              >
                Rehber <Icon name="external" size={13} />
              </a>
            </div>
          ) : null}

          {storageMode === 'local' ? (
            <div className="admin-banner admin-banner--warn">
              <Icon name="monitor" size={18} />
              <div>
                <strong>Yerel geliştirme modu</strong>
                <p>
                  Kayıtlar <code>.data/content.json</code> dosyasına yazılıyor. Yayındaki
                  değişikliklerin kalıcı olması için Vercel Blob bağla.
                </p>
              </div>
            </div>
          ) : null}

          {!isInbox && tab.id === 'brand' ? (
            <section className="admin-theme-studio">
              <div className="admin-theme-studio__head">
                <div>
                  <h2>Tek Tıkla Hazır Tema Paletleri</h2>
                  <p>
                    Bir palete tıklayarak sitenin arka plan, yüzey, yazı ve vurgu renklerini anında
                    değiştirebilir, ardından aşağıdaki renk seçicilerle ince ayar yapabilirsin.
                  </p>
                </div>
              </div>

              <div className="admin-presets">
                {THEME_PRESETS.map((preset) => {
                  const active = isPresetActive(preset);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      className={`admin-preset ${active ? 'is-active' : ''}`}
                      onClick={() => applyThemePreset(preset)}
                    >
                      <div className="admin-preset__swatches">
                        <span style={{ background: preset.colors.bg }} title="Arka plan" />
                        <span style={{ background: preset.colors.bgElevated }} title="Yüzey" />
                        <span style={{ background: preset.colors.ink }} title="Ana yazı" />
                        <span style={{ background: preset.colors.accent }} title="Ana vurgu" />
                      </div>
                      <strong>{preset.name}</strong>
                      <small>{preset.subtitle}</small>
                    </button>
                  );
                })}
              </div>

              <div
                className="admin-live-preview"
                style={{
                  background: content.brand.bg,
                  color: content.brand.ink,
                  borderColor: content.brand.accent
                }}
              >
                <div className="admin-live-preview__copy">
                  <span
                    className="admin-live-preview__tag"
                    style={{ color: content.brand.muted }}
                  >
                    CANLI TEMA ÖNİZLEMESİ • {content.brand.name}
                  </span>
                  <strong>
                    {content.hero.title}{' '}
                    <em style={{ color: content.brand.accent, fontFamily: 'var(--serif)' }}>
                      {content.hero.titleAccent}
                    </em>
                  </strong>
                  <p style={{ color: content.brand.muted }}>{content.hero.description}</p>
                </div>
                <div
                  className="admin-live-preview__card"
                  style={{ background: content.brand.bgElevated }}
                >
                  <span
                    className="admin-live-preview__btn"
                    style={{
                      background: content.brand.accent,
                      color: contrastInk(content.brand.accent)
                    }}
                  >
                    {content.hero.primaryCta.label} ↗
                  </span>
                </div>
              </div>
            </section>
          ) : null}

          {isInbox ? (
            <InboxView onUnreadChange={setInboxUnread} />
          ) : isConsent ? (
            <ConsentView />
          ) : (
          <div className="admin-groups" key={tabId}>
            {tab.groups.map((group) => (
              <section className="admin-group" key={group.title}>
                <header className="admin-group__head">
                  <h2>{group.title}</h2>
                  {group.description ? <p>{group.description}</p> : null}
                </header>
                <div className="admin-grid">
                  {group.fields.map((field) => (
                    <FieldRenderer
                      key={field.key}
                      field={field}
                      value={getByPath(content, field.key)}
                      onChange={(value) =>
                        setContent((previous) => setByPath(previous, field.key, value))
                      }
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
          )}

          <footer className="admin-footer">
            <span>
              {lastSaved
                ? `Son kayıt: ${lastSaved.toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}`
                : 'Değişiklikler yayınlandığında sitede anında görünür.'}
            </span>
            <span>
              <kbd>Ctrl</kbd> + <kbd>S</kbd> ile hızlı kaydet
            </span>
          </footer>
        </div>
      </main>

      {dirty ? (
        <div className="admin-savebar">
          <span>Kaydedilmemiş değişiklikler var</span>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={() => void save()}
            disabled={saving || storageMode === 'locked'}
          >
            {saving ? 'Kaydediliyor...' : 'Yayınla'}
          </button>
        </div>
      ) : null}

      {toast ? (
        <div className={`admin-toast admin-toast--${toast.type}`} role="status" aria-live="polite">
          <Icon name={toast.type === 'success' ? 'check' : 'bolt'} size={16} />
          {toast.text}
          <button type="button" aria-label="Kapat" onClick={() => setToast(null)}>
            <Icon name="close" size={14} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
