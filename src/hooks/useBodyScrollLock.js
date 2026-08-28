import { useEffect } from 'react';

// Ref-counted, so a drawer opening over a modal (or two overlays racing their
// unmounts) cannot restore scrolling while one is still on screen.
let locks = 0;
let previousOverflow = '';

export default function useBodyScrollLock(active = true) {
  useEffect(() => {
    if (!active) return undefined;

    if (locks === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    locks += 1;

    return () => {
      locks -= 1;
      if (locks === 0) document.body.style.overflow = previousOverflow;
    };
  }, [active]);
}
