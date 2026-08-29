import { useId, useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import FilterPanel from './FilterPanel.jsx';
import FilterDrawer from './FilterDrawer.jsx';
import SortSelect from './SortSelect.jsx';
import ActiveFilterChips from './ActiveFilterChips.jsx';
import cx from '../../utils/cx.js';

/**
 * Collapsed by default, on every screen size. Expanded, the facets are taller
 * than the viewport lets the first row of sarees survive — the shop opened on
 * a wall of controls with no product visible. Filtering is the exception;
 * browsing is the default, so the panel earns its space only when asked for.
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
  const [expanded, setExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const panelId = useId();

  const panelProps = { filters, facets, setFilter, setFilters, toggleFilter };

  function removeItem(item) {
    if (item.key === 'price') return setFilters({ minPrice: null, maxPrice: null });
    if (item.key === 'minDiscount') return setFilter('minDiscount', 0);
    if (item.key === 'newOnly') return setFilter('newOnly', false);
    return toggleFilter(item.key, item.value);
  }

  const countBadge = activeCount > 0 && (
    <span className="grid h-5 min-w-5 place-items-center rounded-pill bg-maroon px-1 text-[0.68rem] tabular-nums text-ivory">
      {activeCount}
    </span>
  );

  const triggerClass =
    'min-h-10 items-center gap-2 border border-glass-edge bg-glass-strong px-4 text-meta text-ink transition-colors hover:border-maroon hover:text-maroon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

  return (
    <div
      role="group"
      aria-label="Collection filters"
      className="mb-6 rounded-panel border border-glass-edge bg-glass px-4 py-3 shadow-glass backdrop-blur-glass"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Below md the facets live in a bottom sheet; above it they expand in place. */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className={cx(triggerClass, 'inline-flex md:hidden')}
        >
          <SlidersHorizontal size={15} aria-hidden="true" />
          Filters
          {countBadge}
        </button>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={panelId}
          className={cx(triggerClass, 'hidden md:inline-flex')}
        >
          <SlidersHorizontal size={15} aria-hidden="true" />
          Filters
          {countBadge}
          <ChevronDown
            size={15}
            aria-hidden="true"
            className={cx('transition-transform duration-200', expanded && 'rotate-180')}
          />
        </button>

        <SortSelect value={filters.sort} onChange={(value) => setFilter('sort', value)} />
      </div>

      <div
        id={panelId}
        hidden={!expanded}
        className="mt-4 hidden border-t border-glass-edge pt-5 md:block"
      >
        <FilterPanel {...panelProps} layout="bar" />
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
