import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function useReveal({ selector = ':scope > *', max = 12 } = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    if (prefersReducedMotion()) return undefined;

    const targets = Array.from(container.querySelectorAll(selector)).slice(0, max);
    if (!targets.length) return undefined;

    targets.forEach((el) => {
      el.style.opacity = '0';
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animate(targets, {
            opacity: [0, 1],
            translateY: [16, 0],
            delay: stagger(60),
            duration: 320,
            easing: 'easeOutQuad',
          });

          obs.disconnect();
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [selector, max]);

  return containerRef;
}
