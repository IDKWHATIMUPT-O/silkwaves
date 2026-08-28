import ProductGrid from '../components/product/ProductGrid.jsx';
import FilterBar from '../components/filters/FilterBar.jsx';
import useProductFilters from '../hooks/useProductFilters.js';

export default function Collections() {
  const {
    status,
    error,
    filters,
    facets,
    visibleProducts,
    activeCount,
    setFilter,
    setFilters,
    toggleFilter,
    clearAll,
  } = useProductFilters();

  // 'idle' is grouped with 'loading': the hook starts idle, and treating it as
  // a separate state rendered one blank frame before the first fetch.
  const pending = status === 'idle' || status === 'loading';

  return (
    <section className="mx-auto w-[min(1160px,calc(100%-32px))] py-14 md:py-16">
      <div className="mb-7">
        <span className="eyebrow">Collections</span>
        <h1 className="mt-2 text-h1">Sarees for every occasion</h1>
      </div>

      {!pending && status !== 'error' && (
        <FilterBar
          filters={filters}
          facets={facets}
          activeCount={activeCount}
          resultCount={visibleProducts.length}
          setFilter={setFilter}
          setFilters={setFilters}
          toggleFilter={toggleFilter}
          clearAll={clearAll}
        />
      )}

      {pending && (
        <p className="m-0 rounded-panel border border-line bg-ivory p-7 text-center text-muted">
          Loading collections…
        </p>
      )}

      {status === 'error' && (
        <p className="m-0 rounded-panel border border-line bg-ivory p-7 text-center text-muted">
          Unable to load products: {error?.message}
        </p>
      )}

      {status === 'success' && (
        <>
          <p className="mb-4 text-meta tabular-nums text-muted" aria-live="polite">
            {visibleProducts.length} {visibleProducts.length === 1 ? 'saree' : 'sarees'}
          </p>
          <ProductGrid
            products={visibleProducts}
            emptyMessage={
              activeCount > 0
                ? 'No sarees match these filters. Try widening them.'
                : 'No sarees to show yet.'
            }
          />
        </>
      )}
    </section>
  );
}
