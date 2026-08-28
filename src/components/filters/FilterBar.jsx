import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import FilterPanel from './FilterPanel.jsx';
import FilterDrawer from './FilterDrawer.jsx';
import SortSelect from './SortSelect.jsx';
import ActiveFilterChips from './ActiveFilterChips.jsx';

/**
 * Glass shell: translucent ivory over the page, a light rim, and one inner top
 * highlight from --shadow-glass. Carries role="group" — the old bar had an
 * aria-label sitting on a plain div, where it was ignored entirely.
 */
export default function FilterBar({
  filters,
  facets,
  activeCount,
  resultCount,
  setFilter,
  setFilters,
  toggleFilter,
  clearAll,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const panelProps = { filters, facets, setFilter, setFilters, toggleFilter };

  function removeItem(item) {
    if (item.key === 'price') return setFilters({ minPrice: null, maxPrice: null });
    if (item.key === 'minDiscount') return setFilter('minDiscount', 0);
    if (item.key === 'newOnly') return setFilter('newOnly', false);
    return toggleFilter(item.key, item.value);
  }

  return (
    <div
      role="group"
      aria-label="Collection filters"
      className="mb-7 rounded-panel border border-glass-edge bg-glass p-5 shadow-glass backdrop-blur-glass"
    >
      <div className="flex items-center justify-between gap-4 md:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex min-h-10 items-center gap-2 rounded-pill border border-glass-edge bg-glass-strong px-4 text-meta text-ink transition-colors hover:border-maroon hover:text-maroon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <SlidersHorizontal size={15} aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-pill bg-maroon px-1 text-[0.68rem] tabular-nums text-ivory">
              {activeCount}
            </span>
          )}
        </button>
        <SortSelect value={filters.sort} onChange={(value) => setFilter('sort', value)} />
      </div>

      <div className="hidden md:flex md:items-start md:justify-between md:gap-8">
        <FilterPanel {...panelProps} layout="bar" />
        <div className="shrink-0 pt-1">
          <SortSelect value={filters.sort} onChange={(value) => setFilter('sort', value)} />
        </div>
      </div>

      <ActiveFilterChips
        filters={filters}
        bounds={facets.priceBounds}
        activeCount={activeCount}
        onRemove={removeItem}
        onClearAll={clearAll}
      />

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        resultCount={resultCount}
        {...panelProps}
      />
    </div>
  );
}
