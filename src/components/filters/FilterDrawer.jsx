import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import FilterPanel from './FilterPanel.jsx';
import useFocusTrap from '../../hooks/useFocusTrap.js';
import useBodyScrollLock from '../../hooks/useBodyScrollLock.js';

// Bottom sheet for small screens. The grid keeps updating live underneath, but
// it is behind the sheet, so nothing visibly thrashes while facets are tapped.
export default function FilterDrawer({ open, onClose, resultCount, ...panelProps }) {
  const panelRef = useRef(null);
  useBodyScrollLock(open);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end bg-ink/45 backdrop-blur-sm md:hidden"
      onMouseDown={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-panel border-t border-glass-edge bg-glass-strong px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] pt-5 shadow-glass backdrop-blur-glass-lg"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="m-0 text-h3">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="grid h-9 w-9 place-items-center rounded-pill border border-glass-edge bg-glass text-ink transition-colors hover:border-maroon hover:text-maroon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <FilterPanel {...panelProps} layout="drawer" />

        <button
          type="button"
          onClick={onClose}
          className="sticky bottom-0 mt-6 w-full rounded-control bg-maroon py-3 text-ivory shadow-raised transition-colors hover:bg-maroon-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Show {resultCount} {resultCount === 1 ? 'saree' : 'sarees'}
        </button>
      </div>
    </div>,
    document.body,
  );
}
