import { useEffect, useRef, useState } from 'react';

/**
 * The opening view: the same rotating mandala and logo the countdown used, so
 * arriving at the launched shop feels continuous with what people saw before it.
 *
 * As you scroll the first screen, the mandala grows and fades — it opens out of
 * the way rather than sliding off — and the wordmark lifts and dissolves with it.
 */
export default function MandalaHero() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    // Reduced motion gets the static composition. It still scrolls away
    // normally; it just does not animate as it goes.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;

    function update() {
      frame = 0;
      const height = section.offsetHeight || window.innerHeight;
      const progress = Math.min(1, Math.max(0, window.scrollY / height));

      // Written straight to the node rather than held in state: this runs on
      // every scroll frame, and a re-render per frame would be wasteful.
      section.style.setProperty('--mandala-scale', String(1 + progress * 0.9));
      section.style.setProperty('--mandala-fade', String(1 - progress));

      if (contentRef.current) {
        contentRef.current.style.opacity = String(Math.max(0, 1 - progress * 1.7));
        contentRef.current.style.transform = `translateY(${-progress * 44}px)`;
      }
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative -mt-[76px] flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ivory px-6 pt-[76px]"
    >
      <div className="mandala" aria-hidden="true">
        <img src="/mandala.webp" alt="" width="740" height="740" className="mandala-img" />
      </div>

      <div ref={contentRef} className="relative flex flex-col items-center text-center">
        {!logoFailed && (
          <img
            src="/logo.webp"
            alt=""
            width="700"
            height="573"
            fetchPriority="high"
            className="mb-5 h-[min(26vh,12rem)] w-auto max-w-[70vw] object-contain drop-shadow-[0_14px_36px_rgba(122,31,43,0.14)]"
            onError={() => setLogoFailed(true)}
          />
        )}

        <h1
          className="text-balance font-display text-5xl tracking-wide text-maroon sm:text-6xl"
          translate="no"
        >
          SILK <span className="text-gold">WAVES</span>
        </h1>
        <p className="mt-3 text-[0.7rem] uppercase tracking-[0.4em] text-muted">
          Grace in every drape
        </p>
      </div>

      {/* Tells people there is more below, which a full-screen opening otherwise
          leaves ambiguous. Decorative: the section below is reachable by
          scrolling or tabbing regardless. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.35em] text-muted">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}
