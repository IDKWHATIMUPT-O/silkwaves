import FacetGroup from './FacetGroup.jsx';
import FilterChip from './FilterChip.jsx';
import ColorSwatchFilter from './ColorSwatchFilter.jsx';
import PriceRangeFilter from './PriceRangeFilter.jsx';
import { AVAILABILITY, DISCOUNT_BUCKETS } from '../../utils/productFilters.js';

/**
 * Every facet, shared by the desktop bar and the mobile drawer so the two can
 * never drift apart. Groups whose facet has nothing to offer are not rendered —
 * that is what keeps the colour group invisible until the backend ships the
 * field, rather than showing an empty row.
 */
export default function FilterPanel({ filters, facets, setFilter, setFilters, toggleFilter, layout = 'bar' }) {
  const wrap = layout === 'bar' ? 'flex flex-wrap items-start gap-x-8 gap-y-5' : 'flex flex-col gap-6';

  const usableDiscounts = DISCOUNT_BUCKETS.filter((b) => b <= facets.maxDiscount);

  return (
    <div className={wrap}>
      {facets.categories.length > 1 && (
        <FacetGroup label="Type">
          {facets.categories.map((category) => (
            <FilterChip
              key={category.value}
              selected={filters.categories.includes(category.value)}
              onSelect={() => toggleFilter('categories', category.value)}
              count={category.count}
            >
              {category.value}
            </FilterChip>
          ))}
        </FacetGroup>
      )}

      {facets.colors.length > 0 && (
        <FacetGroup label="Colour">
          <ColorSwatchFilter
            colors={facets.colors}
            selected={filters.colors}
            onToggle={(slug) => toggleFilter('colors', slug)}
          />
        </FacetGroup>
      )}

      {facets.priceBounds.max > facets.priceBounds.min && (
        <PriceRangeFilter
          bounds={facets.priceBounds}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={({ minPrice, maxPrice }) =>
            setFilters({ minPrice, maxPrice }, { replace: true })
          }
        />
      )}

      {usableDiscounts.length > 0 && (
        <FacetGroup label="Discount" mode="single">
          <FilterChip
            mode="single"
            selected={!filters.minDiscount}
            onSelect={() => setFilter('minDiscount', 0)}
          >
            Any
          </FilterChip>
          {usableDiscounts.map((bucket) => (
            <FilterChip
              key={bucket}
              mode="single"
              selected={filters.minDiscount === bucket}
              onSelect={() => setFilter('minDiscount', bucket)}
            >
              {bucket}% or more
            </FilterChip>
          ))}
        </FacetGroup>
      )}

      <FacetGroup label="Availability">
        {AVAILABILITY.map((option) => (
          <FilterChip
            key={option.value}
            selected={filters.availability.includes(option.value)}
            onSelect={() => toggleFilter('availability', option.value)}
          >
            {option.label}
          </FilterChip>
        ))}
        {facets.hasNew && (
          <FilterChip
            selected={filters.newOnly}
            onSelect={() => setFilter('newOnly', !filters.newOnly)}
          >
            New arrivals
          </FilterChip>
        )}
      </FacetGroup>
    </div>
  );
}
