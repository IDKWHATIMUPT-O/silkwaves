import { useRef } from 'react';
import cx from '../../utils/cx.js';

/**
 * Wraps one facet. `mode` decides the a11y contract, and the two are genuinely
 * different: a multi-select group is a set of independent toggles, a
 * single-select group is one radio group with roving focus and arrow keys.
 * Treating them the same is how filter UIs end up unusable by keyboard.
 */
export default function FacetGroup({ label, mode = 'multi', children, className = '' }) {
  const ref = useRef(null);

  function onKeyDown(event) {
    if (mode !== 'single') return;
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
    if (!keys.includes(event.key)) return;

    const radios = [...(ref.current?.querySelectorAll('[role="radio"]') ?? [])];
    if (radios.length < 2) return;

    event.preventDefault();
    const current = radios.indexOf(document.activeElement);
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const next = radios[(current + step + radios.length) % radios.length];
    next?.focus();
    next?.click();
  }

  return (
    <div className={cx('flex flex-col gap-2.5', className)}>
      <span className="eyebrow">{label}</span>
      <div
        ref={ref}
        role={mode === 'single' ? 'radiogroup' : 'group'}
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-2"
      >
        {children}
      </div>
    </div>
  );
}
