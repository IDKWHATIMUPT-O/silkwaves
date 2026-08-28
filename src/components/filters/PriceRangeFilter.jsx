import { useEffect, useId, useState } from 'react';
import { formatPrice } from '../../utils/currency.js';

/**
 * Two labelled native range inputs rather than an overlapped dual-thumb.
 * Overlapping two sliders needs pointer-events juggling to keep both thumbs
 * grabbable, and it degrades badly on touch; two native inputs are keyboard
 * operable for free and cannot trap a thumb behind its twin.
 *
 * Writes are debounced and use replace:true, so dragging does not bury the
 * back button under a hundred history entries.
 */
export default function PriceRangeFilter({ bounds, minPrice, maxPrice, onChange }) {
  const id = useId();
  const [local, setLocal] = useState({
    min: minPrice ?? bounds.min,
    max: maxPrice ?? bounds.max,
  });

  useEffect(() => {
    setLocal({ min: minPrice ?? bounds.min, max: maxPrice ?? bounds.max });
  }, [minPrice, maxPrice, bounds.min, bounds.max]);

  useEffect(() => {
    const atDefault = local.min <= bounds.min && local.max >= bounds.max;
    const t = setTimeout(() => {
      onChange({
        minPrice: local.min > bounds.min ? local.min : null,
        maxPrice: local.max < bounds.max ? local.max : null,
        atDefault,
      });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local.min, local.max]);

  const step = Math.max(1, Math.round((bounds.max - bounds.min) / 100));

  return (
    <div className="flex min-w-56 flex-col gap-2.5">
      <span className="eyebrow">Price</span>
      <p className="m-0 text-meta tabular-nums text-muted">
        {formatPrice(local.min)} — {formatPrice(local.max)}
      </p>
      <label className="flex items-center gap-2 text-[0.7rem] text-muted" htmlFor={`${id}-min`}>
        <span className="w-8">Min</span>
        <input
          id={`${id}-min`}
          type="range"
          className="h-1 w-full accent-maroon"
          min={bounds.min}
          max={bounds.max}
          step={step}
          value={local.min}
          onChange={(e) =>
            setLocal((s) => ({ ...s, min: Math.min(Number(e.target.value), s.max) }))
          }
        />
      </label>
      <label className="flex items-center gap-2 text-[0.7rem] text-muted" htmlFor={`${id}-max`}>
        <span className="w-8">Max</span>
        <input
          id={`${id}-max`}
          type="range"
          className="h-1 w-full accent-maroon"
          min={bounds.min}
          max={bounds.max}
          step={step}
          value={local.max}
          onChange={(e) =>
            setLocal((s) => ({ ...s, max: Math.max(Number(e.target.value), s.min) }))
          }
        />
      </label>
    </div>
  );
}
