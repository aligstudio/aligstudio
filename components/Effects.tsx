'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function Effects() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const cleanups: Array<() => void> = [];

    try {
      let lastY = window.scrollY;
      let ticking = false;
      const showcase = document.querySelector<HTMLElement>('.hero-showcase');
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          try {
            const y = window.scrollY;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
            }
            const header = document.querySelector<HTMLElement>('.site-header');
            if (header && !document.body.classList.contains('menu-open')) {
              if (y > 320 && y > lastY + 4) header.classList.add('is-hidden');
              else if (y < lastY - 4 || y <= 320) header.classList.remove('is-hidden');
            }
            if (showcase && !reduce && y < window.innerHeight * 1.5) {
              showcase.style.translate = `0 ${(y * 0.08).toFixed(1)}px`;
            }
            lastY = y;
          } finally {
            ticking = false;
          }
        });
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener('scroll', onScroll);
        if (showcase) showcase.style.translate = '';
      });
    } catch {
      /* scroll efektleri kapalı kalsa da site çalışır */
    }

    if (fine && !reduce) {
      try {
        let glowRaf = 0;
        let gx = window.innerWidth / 2;
        let gy = window.innerHeight / 3;
        let tx = gx;
        let ty = gy;
        let glowOn = false;
        let lastMove = 0;
        const moveGlow = () => {
          gx += (tx - gx) * 0.12;
          gy += (ty - gy) * 0.12;
          if (glowRef.current) {
            glowRef.current.style.transform = `translate3d(${gx - 260}px, ${gy - 260}px, 0)`;
          }
          if (Math.abs(tx - gx) > 0.3 || Math.abs(ty - gy) > 0.3 || performance.now() - lastMove < 1500) {
            glowRaf = requestAnimationFrame(moveGlow);
          } else {
            glowOn = false;
          }
        };
        const onMove = (e: MouseEvent) => {
          tx = e.clientX;
          ty = e.clientY;
          lastMove = performance.now();
          if (!glowOn) {
            glowOn = true;
            if (glowRef.current) glowRef.current.style.opacity = '1';
            glowRaf = requestAnimationFrame(moveGlow);
          }
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        cleanups.push(() => {
          window.removeEventListener('mousemove', onMove);
          cancelAnimationFrame(glowRaf);
        });
      } catch {
        /* cursor glow kapalı */
      }

      try {
        const magnets = Array.from(
          document.querySelectorAll<HTMLElement>(
            '.hero__actions .btn--accent, .site-header .header-cta, .contact-form__foot .btn--accent'
          )
        );
        magnets.forEach((el) => {
          const onM = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            el.style.translate = `${(dx * 0.18).toFixed(1)}px ${(dy * 0.18).toFixed(1)}px`;
          };
          const onL = () => {
            el.style.translate = '0px 0px';
          };
          el.addEventListener('mousemove', onM);
          el.addEventListener('mouseleave', onL);
          cleanups.push(() => {
            el.removeEventListener('mousemove', onM);
            el.removeEventListener('mouseleave', onL);
            el.style.translate = '';
          });
        });
      } catch {
        /* magnetic kapalı */
      }

      try {
        const posters = Array.from(document.querySelectorAll<HTMLElement>('.work-card__poster'));
        posters.forEach((el) => {
          const onM = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            el.style.transform = `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg)`;
          };
          const onL = () => {
            el.style.transform = '';
          };
          el.addEventListener('mousemove', onM);
          el.addEventListener('mouseleave', onL);
          cleanups.push(() => {
            el.removeEventListener('mousemove', onM);
            el.removeEventListener('mouseleave', onL);
            el.style.transform = '';
          });
        });
      } catch {
        /* tilt kapalı */
      }
    }

    try {
      const counters = Array.from(document.querySelectorAll<HTMLElement>('.hero-stat__value'));
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            io.unobserve(el);
            const raw = el.textContent || '';
            const m = raw.match(/^(\d+)(.*)$/);
            if (!m || raw.includes("'") || reduce) return;
            const target = Number(m[1]);
            const suffix = m[2];
            const start = performance.now();
            const dur = 1300;
            const step = (now: number) => {
              const p = Math.min((now - start) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              el.textContent = `${Math.round(target * eased)}${suffix}`;
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    } catch {
      /* count-up kapalı */
    }

    return () => {
      cleanups.forEach((fn) => {
        try {
          fn();
        } catch {
          /* yoksay */
        }
      });
    };
  }, [pathname]);

  return (
    <>
      <div ref={barRef} className="scroll-progress" aria-hidden="true" />
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
    </>
  );
}
