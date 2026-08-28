import { useMemo } from 'react';
import ProductGrid from '../components/product/ProductGrid.jsx';
import useProducts from '../hooks/useProducts.js';

export default function Sale() {
  const { products, status, error } = useProducts();

  const saleProducts = useMemo(
    () => products.filter((product) => product.compareAtPrice > product.price),
    [products]
  );

  return (
    <section className="mx-auto w-[min(1160px,calc(100%-32px))] py-14 md:py-16">
      <div className="mb-7">
        <span className="eyebrow">Sale</span>
        <h1 className="mt-2 text-h1">Discounted Sarees</h1>
      </div>

      {status === 'loading' && (
        <p className="m-0 rounded-lg border border-line bg-ivory p-7 text-center text-muted">
          Loading sale items...
        </p>
      )}
      {status === 'error' && (
        <p className="m-0 rounded-lg border border-line bg-ivory p-7 text-center text-muted">
          Unable to load products: {error.message}
        </p>
      )}
      {status === 'success' && (
        saleProducts.length === 0 ? (
          <p className="m-0 rounded-lg border border-line bg-ivory p-7 text-center text-muted">
            No items on sale right now — check back soon.
          </p>
        ) : (
          <ProductGrid products={saleProducts} />
        )
      )}
    </section>
  );
}
