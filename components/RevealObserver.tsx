'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * A single observer for every [data-reveal] element on the page.
 * Server components can opt into the reveal animation without becoming client components.
 *
 * IMPORTANT: reveal state is tracked with a `data-reveal-pending` ATTRIBUTE (not a
 * class) because React re-renders rewrite the `className` prop of interactive
 * client components (e.g. the FAQ accordion) and would wipe observer-applied
 * classes — making the item vanish (opacity: 0) after a click. Attributes that
 * React does not manage survive re-renders. Elements added later (re-mounted
 * list items) simply have no pending attribute, so they show immediately and
 * can never get stuck invisible.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    document.body.classList.add('reveal-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.removeAttribute('data-reveal-pending');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
    );

    elements.forEach((el) => {
      // Already in view: leave visible right away.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      el.setAttribute('data-reveal-pending', '');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
