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
      return a.id - b.id;
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
    <section className="section-shell page page--collections">
      <div className="page-title">
        <span className="eyebrow">Collections</span>
        <h1>Sarees for every occasion</h1>
      </div>

      <div className="toolbar" aria-label="Collection filters">
        <div className="segmented-control">
          {['All', ...categories].map((item) => (
            <button
              className={category === item ? 'is-active' : ''}
              key={item}
              type="button"
              onClick={() => updateParam('category', item)}
            >
              {item === 'All' ? 'All' : `${item} Sarees`}
            </button>
          ))}
        </div>

        <label className="select-field">
          <span>Sort</span>
          <select value={sort} onChange={(event) => updateParam('sort', event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
          </select>
        </label>
      </div>

      {status === 'loading' && <p className="empty-state">Loading collections...</p>}
      {status === 'error' && <p className="empty-state">Unable to load products: {error.message}</p>}
      {status === 'success' && <ProductGrid products={visibleProducts} />}
    </section>
  );
}
