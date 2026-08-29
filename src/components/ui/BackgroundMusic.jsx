import { useEffect, useRef, useState } from 'react';

// Background ambience, kept well under the voices on the page.
const VOLUME = 0.3;

const GESTURES = ['pointerdown', 'keydown', 'touchstart', 'wheel'];

const PREFERENCE_KEY = 'silkwaves:sound';

// Someone who switched the music off should not have to switch it off again on
// the next page or the next visit. Wrapped because storage throws outright in
// some privacy modes rather than just returning null.
function readPreference() {
  try {
    return localStorage.getItem(PREFERENCE_KEY);
  } catch {
    return null;
  }
}

function writePreference(value) {
  try {
    localStorage.setItem(PREFERENCE_KEY, value);
  } catch {
    /* no persistence available; the session still works */
  }
}

// The file is already trimmed to begin at the 25s mark, so the browser's own
// loop handles repeats seamlessly — no seeking back on every pass.
export default function BackgroundMusic({ src }) {
  const audioRef = useRef(null);
  const detachRef = useRef(() => {});
  const userDecidedRef = useRef(false);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    audio.volume = VOLUME;
    let cancelled = false;

    // The label follows the element's real state rather than whatever play()
    // resolved to: a browser can resolve that promise and still refuse to make
    // a sound, which left the button advertising music that was not playing.
    const sync = () => setSoundOn(!audio.paused);
    audio.addEventListener('play', sync);
    audio.addEventListener('pause', sync);
    sync();

    const start = async () => {
      try {
        await audio.play();
        return !audio.paused;
      } catch {
        return false;
      }
    };

    // Nothing starts on its own for someone who has already switched the music
    // off, or who has asked their system for reduced motion. The button still
    // works — it just has to be their decision.
    if (
      readPreference() === 'off' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return () => {
        cancelled = true;
        audio.removeEventListener('play', sync);
        audio.removeEventListener('pause', sync);
      };
    }

    // Browsers refuse to start audible playback until the visitor has
    // interacted with the page, so this first attempt usually rejects. When it
    // does, wait for any gesture and start then.
    start().then((started) => {
      if (started || cancelled || userDecidedRef.current) return;

      const onFirstGesture = async (event) => {
        // A click on the sound button is the button's business, not ours —
        // otherwise this fires first and overrides what the visitor chose.
        if (event.target?.closest?.('.cs-audio-toggle')) return;
        if (userDecidedRef.current) {
          detachRef.current();
          return;
        }
        if (await start()) detachRef.current();
      };

      GESTURES.forEach((e) =>
        window.addEventListener(e, onFirstGesture, { passive: true }),
      );
      detachRef.current = () => {
        GESTURES.forEach((e) => window.removeEventListener(e, onFirstGesture));
        detachRef.current = () => {};
      };
    });

    return () => {
      cancelled = true;
      detachRef.current();
      audio.removeEventListener('play', sync);
      audio.removeEventListener('pause', sync);
    };
  }, []);

  // Pauses rather than mutes, so switching it off also stops the download.
  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    // Once the visitor has chosen, nothing else gets to start the music.
    userDecidedRef.current = true;
    detachRef.current();

    if (audio.paused) {
      audio.volume = VOLUME;
      writePreference('on');
      audio.play().catch(() => {});
    } else {
      writePreference('off');
      audio.pause();
    }
  }

  return (
    <>
      {/* preload="none" so visitors who never interact are not billed for a
          2.9 MB download they will never hear. */}
      <audio ref={audioRef} src={src} loop preload="none" />

      {/* aria-pressed already carries on/off, so the name stays fixed. Changing
          both meant screen readers announced the state twice, in conflicting
          terms — "Turn music on, pressed". */}
      <button
        type="button"
        onClick={toggle}
        className="cs-audio-toggle"
        aria-pressed={soundOn}
        aria-label="Background music"
        title="Background music"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M11 5 6 9H3v6h3l5 4V5z" />
          {soundOn ? (
            <>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </>
          ) : (
            <>
              <path d="M16 9.5 21 15" />
              <path d="M21 9.5 16 15" />
            </>
          )}
        </svg>
      </button>
    </>
  );
}
