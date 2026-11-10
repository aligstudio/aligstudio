'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Icon } from '@/components/icons';
import type { InboxMessage } from '@/lib/inbox';

type Props = {
  onUnreadChange?: (unread: number) => void;
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function snippet(value: string, max = 120): string {
  const flat = value.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

export function InboxView({ onUnreadChange }: Props) {
  const [messages, setMessages] = useState<InboxMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const load = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch('/api/admin/inbox', { cache: 'no-store' });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        messages?: InboxMessage[];
        unread?: number;
        message?: string;
      };
      if (response.status === 401) {
        setError('Oturum sona erdi. Sayfayı yenileyip tekrar giriş yap.');
        setMessages([]);
        return;
      }
      if (!response.ok || !result.ok || !Array.isArray(result.messages)) {
        throw new Error(result.message || 'Gelen kutusu yüklenemedi.');
      }
      setMessages(result.messages);
      onUnreadChange?.(result.messages.filter((item) => !item.read).length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gelen kutusu yüklenemedi.');
      setMessages((prev) => prev ?? []);
    }
  }, [onUnreadChange]);

  useEffect(() => {
    void load();
  }, [load]);

  // sekme açıkken yeni briefleri otomatik çek (15s polling)
  useEffect(() => {
    const t = window.setInterval(() => void load(), 15000);
    return () => window.clearInterval(t);
  }, [load]);

  const items = useMemo(() => {
    const all = messages ?? [];
    return filter === 'unread' ? all.filter((item) => !item.read) : all;
  }, [messages, filter]);

  const selected = useMemo(
    () => (messages ?? []).find((item) => item.id === selectedId) ?? null,
    [messages, selectedId]
  );

  const unread = useMemo(
    () => (messages ?? []).filter((item) => !item.read).length,
    [messages]
  );

  async function act(action: 'read' | 'unread' | 'delete', ids: string[] | 'all') {
    if (busy) return;
    setBusy(true);
    try {
      const response = await fetch('/api/admin/inbox', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, ids }),
        signal: AbortSignal.timeout(15000)
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (response.status === 401) {
        setError('Oturum sona erdi. Sayfayı yenileyip tekrar giriş yap.');
        return;
      }
      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'İşlem tamamlanamadı.');
      }
      if (action === 'delete') {
        if (ids !== 'all') {
          setSelectedId((current) => (current && ids.includes(current) ? null : current));
        } else {
          setSelectedId(null);
        }
        // anlık (optimistic) güncelleme — liste hemen boşalsın
        setMessages((prev) =>
          prev ? prev.filter((m) => (ids === 'all' ? false : !ids.includes(m.id))) : prev
        );
      }
      await load();
      // doğrula: silinenler hâlâ varsa (yazma gecikmesi/çakışma) kullanıcıya net hata göster
      if (action === 'delete') {
        try {
          const check = await fetch('/api/admin/inbox', {
            cache: 'no-store',
            signal: AbortSignal.timeout(10000)
          });
          const r = (await check.json().catch(() => ({}))) as { messages?: { id: string }[] };
          const still = (r.messages ?? []).filter((m) =>
            ids === 'all' ? true : ids.includes(m.id)
          );
          if (check.ok && still.length > 0) {
            setError(
              'Silme henüz kalıcı olmadı (depolama yazısı gecikmiş olabilir). "Tekrar dene"ye bas.'
            );
            await load();
          }
        } catch {
          /* doğrulama atlanabilir */
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'İşlem tamamlanamadı.');
    } finally {
      setBusy(false);
    }
  }

  if (messages === null && !error) {
    return (
      <section className="inbox">
        <div className="inbox-state">
          <Icon name="spark" size={20} />
          <p>Gelen kutusu yükleniyor…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="inbox">
      <div className="inbox-toolbar">
        <div className="inbox-filters">
          <button
            type="button"
            className={`inbox-chip ${filter === 'all' ? 'is-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tümü <b>{messages?.length ?? 0}</b>
          </button>
          <button
            type="button"
            className={`inbox-chip ${filter === 'unread' ? 'is-active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Okunmamış <b>{unread}</b>
          </button>
        </div>
        <div className="inbox-actions">
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            disabled={busy || unread === 0}
            onClick={() => void act('read', 'all')}
          >
            <Icon name="check" size={14} /> Tümünü okundu yap
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--danger"
            disabled={busy || (messages?.length ?? 0) === 0}
            onClick={() => {
              if (window.confirm('Tüm briefler kalıcı olarak silinsin mi? Bu işlem geri alınamaz.')) {
                void act('delete', 'all');
              }
            }}
          >
            <Icon name="trash" size={14} /> Tümünü temizle
          </button>
        </div>
      </div>

      {error ? (
        <div className="admin-banner admin-banner--error">
          <Icon name="bolt" size={18} />
          <div>
            <strong>Bir sorun oluştu</strong>
            <p>{error}</p>
          </div>
          <button type="button" className="admin-banner__link" onClick={() => void load()}>
            Tekrar dene
          </button>
        </div>
      ) : null}

      {items.length === 0 && !error ? (
        <div className="inbox-state">
          <Icon name="mail" size={22} />
          <strong>{filter === 'unread' ? 'Okunmamış brief yok' : 'Henüz brief yok'}</strong>
          <p>
            {filter === 'unread'
              ? 'Tüm mesajları okudun. Yeni briefler burada görünecek.'
              : 'Sitedeki brief formundan gelen mesajlar buraya düşer. Panelden okuyabilir, cevaplayabilir ve silebilirsin.'}
          </p>
        </div>
      ) : null}

      {items.length > 0 ? (
        <div className="inbox-layout">
          <ul className="inbox-list">
            {items.map((item) => {
              const active = item.id === selectedId;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`inbox-item ${active ? 'is-active' : ''} ${item.read ? '' : 'is-unread'}`}
                    onClick={() => {
                      setSelectedId(item.id);
                      if (!item.read) void act('read', [item.id]);
                    }}
                  >
                    <span className="inbox-item__top">
                      {!item.read ? <i className="inbox-item__dot" aria-label="Okunmamış" /> : null}
                      <strong>{item.name}</strong>
                      <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
                    </span>
                    <span className="inbox-item__meta">
                      {item.topic}
                      {item.company ? ` · ${item.company}` : ''}
                    </span>
                    <span className="inbox-item__snippet">{snippet(item.message)}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <aside className="inbox-detail">
            {selected ? (
              <>
                <header>
                  <div>
                    <h3>{selected.name}</h3>
                    <p>
                      {selected.email}
                      {selected.company ? ` · ${selected.company}` : ''}
                    </p>
                  </div>
                  <span className="inbox-detail__date">{formatDate(selected.createdAt)}</span>
                </header>

                <div className="inbox-detail__topic">
                  <Icon name="spark" size={13} /> {selected.topic}
                </div>

                <div className="inbox-detail__message">{selected.message}</div>

                <footer className="inbox-detail__actions">
                  <a
                    className="admin-btn admin-btn--primary"
                    href={`mailto:${encodeURIComponent(selected.email)}?subject=${encodeURIComponent(
                      `Re: ${selected.topic}`
                    )}`}
                  >
                    <Icon name="mail" size={14} /> Cevapla
                  </a>
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    disabled={busy}
                    onClick={() =>
                      void act(selected.read ? 'unread' : 'read', [selected.id])
                    }
                  >
                    <Icon name="check" size={14} />
                    {selected.read ? 'Okunmadı yap' : 'Okundu yap'}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger"
                    disabled={busy}
                    onClick={() => {
                      if (window.confirm('Bu brief silinsin mi?')) {
                        void act('delete', [selected.id]);
                      }
                    }}
                  >
                    <Icon name="trash" size={14} /> Sil
                  </button>
                </footer>
              </>
            ) : (
              <div className="inbox-state inbox-state--soft">
                <Icon name="mail" size={20} />
                <p>Okumak için soldaki listeden bir brief seç.</p>
              </div>
            )}
          </aside>
        </div>
      ) : null}
    </section>
  );
}
