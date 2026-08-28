import { ChevronDown } from 'lucide-react';
import { PRODUCT_SORTS } from '../../utils/productFilters.js';

/**
 * Deliberately the native <select>. A custom listbox would have to re-implement
 * typeahead, arrow semantics and the mobile picker, and would be worse at all
 * three. Restyled, not replaced.
 */
export default function SortSelect({ value, onChange }) {
  return (
    <label className="flex items-center gap-2">
      <span className="eyebrow shrink-0">Sort</span>
      <span className="relative inline-flex items-center">
        <select
          className="min-h-10 appearance-none rounded-control border border-glass-edge bg-glass-strong py-1 pl-3 pr-9 text-meta text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {PRODUCT_SORTS.map((sort) => (
            <option key={sort.value} value={sort.value}>
              {sort.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 text-muted"
        />
      </span>
    </label>
  );
}
