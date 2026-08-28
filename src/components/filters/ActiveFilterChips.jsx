import { X } from 'lucide-react';
import { resolveColor } from '../../data/colors.js';
import { AVAILABILITY } from '../../utils/productFilters.js';
import { formatPrice } from '../../utils/currency.js';

// A visible, removable summary of what is currently narrowing the grid. Without
// it a filter set two scrolls up silently explains an empty result.
export default function ActiveFilterChips({ filters, bounds, activeCount, onRemove, onClearAll }) {
  if (!activeCount) return null;

  const items = [
    ...filters.categories.map((v) => ({ key: 'categories', value: v, label: v })),
    ...filters.colors.map((v) => ({ key: 'colors', value: v, label: resolveColor(v).name })),
    ...filters.availability.map((v) => ({
      key: 'availability',
      value: v,
      label: AVAILABILITY.find((a) => a.value === v)?.label ?? v,
    })),
  ];

  if (filters.minDiscount) {
    items.push({ key: 'minDiscount', value: 0, label: `${filters.minDiscount}% off or more` });
  }
  if (filters.newOnly) items.push({ key: 'newOnly', value: false, label: 'New arrivals' });

  const priceNarrowed =
    (Number.isFinite(filters.minPrice) && filters.minPrice > bounds.min) ||
    (Number.isFinite(filters.maxPrice) && filters.maxPrice < bounds.max);
  if (priceNarrowed) {
    items.push({
      key: 'price',
      value: null,
      label: `${formatPrice(filters.minPrice ?? bounds.min)} — ${formatPrice(filters.maxPrice ?? bounds.max)}`,
    });
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="sr-only">Active filters</span>
      {items.map((item) => (
        <button
          key={`${item.key}-${item.label}`}
          type="button"
          onClick={() => onRemove(item)}
          aria-label={`Remove filter ${item.label}`}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-pill border border-glass-edge bg-glass-strong px-3 text-[0.72rem] text-ink transition-colors duration-200 hover:border-maroon hover:text-maroon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {item.label}
          <X size={13} aria-hidden="true" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="min-h-8 rounded-pill px-2 text-[0.72rem] text-muted underline-offset-2 hover:text-maroon hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Clear all
      </button>
    </div>
  );
}
