import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProducts from './useProducts.js';
import { isOnSale } from '../utils/pricing.js';
import {
  DEFAULT_FILTERS,
  applyFilters,
  countActiveFilters,
  deriveFacets,
  parseFilters,
  serializeFilters,
} from '../utils/productFilters.js';

/**
 * The URL is the only source of truth for filter state — no local mirror to
 * fall out of sync. That is how this page already worked; this just widens it
 * from two params to seven.
 *
 * `preset` narrows the source list before facets are derived, so the Sale page
 * shares the whole mechanism and its facets describe only discounted stock.
 */
export default function useProductFilters({ preset } = {}) {
  const { products, status, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const onSaleOnly = Boolean(preset?.onSale);

  const source = useMemo(
    () => (onSaleOnly ? products.filter(isOnSale) : products),
    [products, onSaleOnly],
  );

  const facets = useMemo(() => deriveFacets(source), [source]);
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const visibleProducts = useMemo(() => applyFilters(source, filters), [source, filters]);
  const activeCount = useMemo(
    () => countActiveFilters(filters, facets.priceBounds),
    [filters, facets.priceBounds],
  );

  const write = useCallback(
    (next, { replace = false } = {}) => setSearchParams(serializeFilters(next), { replace }),
    [setSearchParams],
  );

  // Some controls move two keys at once — a price range is one gesture, not
  // two independent writes that would each push a history entry.
  const setFilters = useCallback(
    (partial, options) => write({ ...filters, ...partial }, options),
    [filters, write],
  );

  const setFilter = useCallback(
    // replace: true for continuous controls (a dragged slider), so one gesture
    // does not bury the back button under fifty history entries.
    (key, value, options) => write({ ...filters, [key]: value }, options),
    [filters, write],
  );

  const toggleFilter = useCallback(
    (key, value) => {
      const current = filters[key] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      write({ ...filters, [key]: next });
    },
    [filters, write],
  );

  const clearFacet = useCallback(
    (key) => write({ ...filters, [key]: DEFAULT_FILTERS[key] }),
    [filters, write],
  );

  // Sort survives a clear — it is a view preference, not a filter.
  const clearAll = useCallback(
    () => write({ ...DEFAULT_FILTERS, sort: filters.sort }),
    [filters.sort, write],
  );

  return {
    products: source,
    status,
    error,
    filters,
    facets,
    visibleProducts,
    activeCount,
    setFilter,
    setFilters,
    toggleFilter,
    clearFacet,
    clearAll,
  };
}
