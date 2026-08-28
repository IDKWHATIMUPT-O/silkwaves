import { formatPrice } from '../../utils/currency.js';
import cx from '../../utils/cx.js';

const SEAL_SIZES = {
  sm: 'h-11 w-11 text-[0.7rem]',
  md: 'h-14 w-14 text-sm',
};

/**
 * The one discount marker for the whole site.
 *
 * Returns null below 1%, so callers never need their own `hasDiscount &&`
 * wrapper. The visible glyph is decorative — the badge carries its own
 * aria-label, because "-24%" read aloud is ambiguous.
 *
 * seal   — image corners; the primary motif
 * ribbon — price rows, where a circle would not sit on the baseline
 * inline — dense lists, no shape at all
 */
export default function SaleBadge({
  percent,
  saved,
  variant = 'seal',
  size = 'sm',
  className = '',
}) {
  if (!Number.isFinite(percent) || percent < 1) return null;

  const label = `${percent} percent off`;

  if (variant === 'inline') {
    return (
      <span
        className={cx('text-meta font-medium text-sale', className)}
        aria-label={Number.isFinite(saved) && saved > 0 ? `Save ${formatPrice(saved)}` : label}
      >
        {Number.isFinite(saved) && saved > 0 ? `Save ${formatPrice(saved)}` : `${percent}% off`}
      </span>
    );
  }

  if (variant === 'ribbon') {
    return (
      <span
        className={cx(
          'sale-ribbon inline-flex items-center py-1 pr-3 text-meta font-medium tracking-wide tabular-nums',
          className,
        )}
        aria-label={label}
      >
        <span aria-hidden="true">{percent}% OFF</span>
      </span>
    );
  }

  return (
    <span
      className={cx('sale-seal font-medium leading-none', SEAL_SIZES[size] ?? SEAL_SIZES.sm, className)}
      aria-label={label}
    >
      <span aria-hidden="true" className="flex flex-col items-center gap-0.5">
        <span className="tabular-nums">{percent}%</span>
        <span className="text-[0.5rem] tracking-[0.18em] opacity-80">OFF</span>
      </span>
    </span>
  );
}
