'use client';

import { useEffect, useState } from 'react';

export function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.body.style.overflow = 'hidden';
      const MIN = reduce ? 200 : 1400;
      const start = performance.now();
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        const wait = Math.max(0, MIN - (performance.now() - start));
        window.setTimeout(() => {
          setDone(true);
          document.body.style.overflow = '';
        }, wait);
      };
      if (document.readyState === 'complete') finish();
      else window.addEventListener('load', finish);
      const safety = window.setTimeout(finish, 4000);
      return () => {
        window.removeEventListener('load', finish);
        window.clearTimeout(safety);
        document.body.style.overflow = '';
      };
    } catch {
      setDone(true);
      document.body.style.overflow = '';
    }
  }, []);

  return (
    <div className={`preloader ${done ? 'is-done' : ''}`} aria-hidden="true">
      <div className="preloader__inner">
        <img src="/logo.png" alt="" className="preloader__logo" />
        <span className="preloader__word">ALIG STUDIO</span>
        <span className="preloader__bar">
          <i />
        </span>
      </div>
    </div>
  );
}
