import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid.jsx';
import useProducts from '../hooks/useProducts.js';
import { categories } from '../services/productService.js';

export default function Collections() {
  const { products, status, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? 'All';
  const sort = searchParams.get('sort') ?? 'featured';

  const visibleProducts = useMemo(() => {
    const filtered = category === 'All' ? products : products.filter((product) => product.category === category);

    return [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [category, products, sort]);

  function updateParam(key, value) {
    const nextParams = new URLSearchParams(searchParams);
    if (value === 'All' || value === 'featured') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    setSearchParams(nextParams);
  }

  return (
    <section className="mx-auto w-[min(1160px,calc(100%-32px))] py-14 md:py-16">
      <div className="mb-7">
        <span className="eyebrow">Collections</span>
        <h1 className="mt-2 text-h1">Sarees for every occasion</h1>
      </div>

      <div
        className="mb-7 flex flex-col gap-5 rounded-lg border border-line bg-ivory-soft p-[18px] md:flex-row md:items-center md:justify-between"
        aria-label="Collection filters"
      >
        <div className="flex flex-wrap gap-2">
          {['All', ...categories].map((item) => (
            <button
              className={`min-h-[42px] rounded-full border px-4 font-semibold transition-colors duration-200 ${
                category === item
                  ? 'border-maroon bg-maroon text-ivory'
                  : 'border-line bg-ivory text-muted hover:border-maroon hover:text-maroon'
              }`}
              key={item}
              type="button"
              onClick={() => updateParam('category', item)}
            >
              {item === 'All' ? 'All' : `${item} Sarees`}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-muted md:flex-row md:items-center">
          <span>Sort</span>
          <select
            className="min-h-[42px] rounded-md border border-line bg-ivory px-3.5 text-ink"
            value={sort}
            onChange={(event) => updateParam('sort', event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
          </select>
        </label>
      </div>

      {status === 'loading' && (
        <p className="m-0 rounded-lg border border-line bg-ivory p-7 text-center text-muted">
          Loading collections...
        </p>
      )}
      {status === 'error' && (
        <p className="m-0 rounded-lg border border-line bg-ivory p-7 text-center text-muted">
          Unable to load products: {error.message}
        </p>
      )}
      {status === 'success' && <ProductGrid products={visibleProducts} />}
    </section>
  );
}
