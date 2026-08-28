import { useEffect } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Holds Tab inside an overlay and hands focus back to whatever opened it.
 * Without the restore, dismissing an overlay drops focus to the top of the
 * document and a keyboard user loses their place in the grid entirely.
 */
export default function useFocusTrap(ref, active = true) {
  useEffect(() => {
    if (!active) return undefined;

    const node = ref.current;
    if (!node) return undefined;

    const opener = document.activeElement;
    const focusables = () => [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);

    // Focus the panel itself rather than its first control, so a screen reader
    // reads the dialog's label before its contents.
    (node.hasAttribute('tabindex') ? node : focusables()[0])?.focus();

    function onKeyDown(event) {
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active_ = document.activeElement;

      if (event.shiftKey && (active_ === first || active_ === node)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active_ === last) {
        event.preventDefault();
        first.focus();
      }
    }

    node.addEventListener('keydown', onKeyDown);
    return () => {
      node.removeEventListener('keydown', onKeyDown);
      if (opener instanceof HTMLElement && document.contains(opener)) opener.focus();
    };
  }, [ref, active]);
}
