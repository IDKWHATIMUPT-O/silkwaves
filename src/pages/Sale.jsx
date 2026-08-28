import ProductGrid from '../components/product/ProductGrid.jsx';
import FilterBar from '../components/filters/FilterBar.jsx';
import useProductFilters from '../hooks/useProductFilters.js';

export default function Sale() {
  // The preset narrows the source before facets are derived, so every count and
  // price bound on this page describes discounted stock only.
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
  } = useProductFilters({ preset: { onSale: true } });

  const pending = status === 'idle' || status === 'loading';

  return (
    <section className="mx-auto w-[min(1160px,calc(100%-32px))] py-14 md:py-16">
      <div className="mb-7">
        <span className="eyebrow">Sale</span>
        <h1 className="mt-2 text-h1">Discounted Sarees</h1>
      </div>

      {!pending && status !== 'error' && visibleProducts.length + activeCount > 0 && (
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
          Loading sale…
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
                ? 'No discounted sarees match these filters.'
                : 'No items on sale right now — check back soon.'
            }
          />
        </>
      )}
    </section>
  );
}
