import { useEffect, useState } from 'react';
import BackgroundMusic from '../components/ui/BackgroundMusic.jsx';

// Sharad Navratri 2026 begins on Sunday 11 October. The launch moved from
// Ganesh Chaturthi; 10 October was considered and dropped because it is Ashwin
// Amavasya, a new moon, which is not a day to open a shop on.
//
// The explicit +05:30 offset means the countdown lands on the same instant no
// matter what timezone the visitor's device is set to.
const LAUNCH_AT = new Date('2026-10-11T11:02:00+05:30');

// Derived from LAUNCH_AT so the printed date can never drift out of sync with
// what the countdown is counting towards. Both the locale and the time zone are
// pinned on purpose: left to the viewer's own, Intl would render "September 14"
// in the US, and for anyone west of India that instant falls on the 13th.
const LAUNCH_DATE_TEXT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
}).format(LAUNCH_AT);

const UNITS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
];

function getRemaining(target) {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) {
    return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const totalSeconds = Math.floor(ms / 1000);
  return {
    done: false,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor(totalSeconds / 3600) % 24,
    minutes: Math.floor(totalSeconds / 60) % 60,
    seconds: totalSeconds % 60,
  };
}

export default function ComingSoon() {
  const [remaining, setRemaining] = useState(() => getRemaining(LAUNCH_AT));
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(LAUNCH_AT)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ivory px-6 py-10 sm:py-16">
      <BackgroundMusic src="/raga.mp3" />

      {/* Rotating rangoli. aria-hidden because it carries no information. */}
      <div className="mandala" aria-hidden="true">
        <img
          src="/mandala.webp"
          alt=""
          width="740"
          height="740"
          className="mandala-img"
        />
      </div>

      <div className="relative flex w-full max-w-3xl flex-col items-center text-center">
        {/* The emblem is decorative — the h1 below carries the brand name, so
            alt is empty rather than repeating it to a screen reader. Capped by
            height, not width: sizing a square mark on width alone pushes the
            countdown below the fold. If the file is ever missing the wordmark
            still stands on its own. */}
        {!logoFailed && (
          <img
            src="/logo.webp"
            alt=""
            width="700"
            height="573"
            fetchPriority="high"
            className="mb-5 h-[min(24vh,11rem)] w-auto max-w-[70vw] object-contain drop-shadow-[0_14px_36px_rgba(122,31,43,0.14)]"
            onError={() => setLogoFailed(true)}
          />
        )}

        <div>
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

        <div className="cs-divider" aria-hidden="true" />

        {remaining.done ? (
          <p className="text-balance font-display text-3xl text-maroon sm:text-4xl">
            We are open. Welcome to <span translate="no">Silk Waves</span>.
          </p>
        ) : (
          <>
            <p className="text-[0.68rem] uppercase tracking-[0.38em] text-muted sm:text-xs">
              Unveiling on Navratri
            </p>

            {/* One clean sentence for screen readers instead of the tiles'
                "31 Days 10 Hours" fragments, where the zero padding also reads
                as "zero seven". Deliberately not a live region: announcing a
                change every second would make the page unusable. Seconds are
                left out so the sentence stays stable if it is ever re-read. */}
            <p className="sr-only">
              {remaining.days} days, {remaining.hours} hours and{' '}
              {remaining.minutes} minutes until the launch on {LAUNCH_DATE_TEXT}.
            </p>

            <div
              className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:gap-4"
              aria-hidden="true"
            >
              {UNITS.map(({ key, label }) => (
                <div key={key} className="cs-tile">
                  <span className="cs-tile-value">
                    {String(remaining[key]).padStart(2, '0')}
                  </span>
                  <span className="cs-tile-label">{label}</span>
                </div>
              ))}
            </div>

            <p className="mt-8 font-display text-lg text-maroon-deep sm:text-xl">
              {LAUNCH_DATE_TEXT}
            </p>
            <p className="mt-1 text-pretty text-xs tracking-[0.18em] text-muted">
              Handwoven silk, curated for the season of new beginnings.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
