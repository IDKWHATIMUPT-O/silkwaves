import ProductCard from './ProductCard.jsx';
import useReveal from '../../hooks/useReveal.js';

// emptyMessage is a prop because the copy differs per page: 'no matches' is
// wrong on an empty wishlist, which is why callers used to wrap this instead.
export default function ProductGrid({ products, emptyMessage = 'No sarees match the selected filters.' }) {
  const gridRef = useReveal({ max: 12 });

  if (!products.length) {
    return (
      <p className="m-0 rounded-lg border border-line bg-ivory p-7 text-center text-muted">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-y-12"
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
