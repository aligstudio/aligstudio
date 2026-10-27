'use client';

import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@/components/icons';

type ConsentEvent = {
  id: string;
  createdAt: string;
  path: string;
  ua: string;
};

type ConsentStats = {
  total: number;
  last7Days: number;
  today: number;
  byDay: { day: string; count: number }[];
};

function shortUa(ua: string): string {
  if (!ua) return '—';
  const browser = /Edg\/|Chrome\/|Safari\/|Firefox\/|OPR\//.exec(ua);
  const mobile = /iPhone|iPad|Android|Mobile/.test(ua);
  const os = /iPhone|iPad|Mac OS X|Windows|Android|Linux/.exec(ua);
  return [browser ? browser[0].replace(/\/$/, '') : '', os ? os[0] : '', mobile ? 'Mobil' : '']
    .filter(Boolean)
    .join(' · ') || 'Bilinmiyor';
}

export function ConsentView() {
  const [events, setEvents] = useState<ConsentEvent[]>([]);
  const [stats, setStats] = useState<ConsentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/consent', { cache: 'no-store' });
      const data = (await response.json()) as {
        ok: boolean;
        events: ConsentEvent[];
        stats: ConsentStats;
      };
      if (!data.ok) throw new Error('Kayıtlar alınamadı.');
      setEvents(data.events);
      setStats(data.stats);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const clear = async () => {
    if (!window.confirm('Tüm çerez onay kayıtları silinsin mi? Bu işlem geri alınamaz.')) return;
    setClearing(true);
    try {
      const response = await fetch('/api/admin/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' })
      });
      const data = (await response.json()) as { ok: boolean };
      if (!data.ok) throw new Error('Silme işlemi başarısız.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir sorun oluştu.');
    } finally {
      setClearing(false);
    }
  };

  return (
    <section className="admin-consent">
      <header className="admin-group__head">
        <h2>Çerez Onayları</h2>
        <p>
          Ziyaretçilerin &ldquo;Kabul Et&rdquo; bildirimleri. Kayıtlarda kişisel veri (isim,
          e-posta, IP) tutulmaz.
        </p>
      </header>

      <div className="admin-consent__stats">
        <div className="admin-consent__stat">
          <span>Toplam onay</span>
          <strong>{stats ? stats.total : '—'}</strong>
        </div>
        <div className="admin-consent__stat">
          <span>Son 7 gün</span>
          <strong>{stats ? stats.last7Days : '—'}</strong>
        </div>
        <div className="admin-consent__stat">
          <span>Bugün</span>
          <strong>{stats ? stats.today : '—'}</strong>
        </div>
        <button
          type="button"
          className="admin-consent__clear"
          onClick={clear}
          disabled={clearing || (stats?.total || 0) === 0}
        >
          <Icon name="trash" size={15} /> {clearing ? 'Siliniyor…' : 'Kayıtları temizle'}
        </button>
      </div>

      {error ? <p className="admin-consent__error">{error}</p> : null}

      {loading ? (
        <p className="admin-consent__empty">Yükleniyor…</p>
      ) : events.length === 0 ? (
        <p className="admin-consent__empty">
          Henüz kayıt yok. Ziyaretçiler cookie banner&rsquo;ında &ldquo;Kabul Et&rdquo; dedikçe
          burada listelenir.
        </p>
      ) : (
        <>
          <div className="admin-consent__days">
            {(stats?.byDay || []).map((row) => (
              <div key={row.day} className="admin-consent__day">
                <span>{row.day}</span>
                <i style={{ width: `${Math.max(8, (row.count / (stats?.total || 1)) * 100)}%` }} />
                <strong>{row.count}</strong>
              </div>
            ))}
          </div>

          <ul className="admin-consent__list">
            {events.slice(0, 100).map((event) => (
              <li key={event.id}>
                <span className="admin-consent__date">
                  {new Date(event.createdAt).toLocaleString('tr-TR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className="admin-consent__path">{event.path}</span>
                <span className="admin-consent__ua">{shortUa(event.ua)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
