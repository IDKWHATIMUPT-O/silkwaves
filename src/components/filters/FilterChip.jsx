import cx from '../../utils/cx.js';

const BASE =
  'inline-flex min-h-10 items-center gap-2 rounded-pill border px-3.5 text-meta ' +
  'transition-colors duration-200 touch-manipulation ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

const REST = 'border-glass-edge bg-glass-strong text-ink hover:border-maroon hover:text-maroon';
const ACTIVE = 'border-maroon bg-maroon text-ivory shadow-raised';

export default function FilterChip({
  children,
  selected = false,
  onSelect,
  mode = 'multi',
  count,
  className = '',
}) {
  // Roving tabindex: only the selected radio is tabbable, arrows move within.
  const radioProps =
    mode === 'single'
      ? { role: 'radio', 'aria-checked': selected, tabIndex: selected ? 0 : -1 }
      : { 'aria-pressed': selected };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(BASE, selected ? ACTIVE : REST, className)}
      {...radioProps}
    >
      {children}
      {Number.isFinite(count) && (
        <span className={cx('tabular-nums text-[0.7rem]', selected ? 'text-ivory/70' : 'text-muted')}>
          {count}
        </span>
      )}
    </button>
  );
}
