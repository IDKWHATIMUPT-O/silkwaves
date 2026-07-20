import ProductCard from './ProductCard.jsx';
import useReveal from '../../hooks/useReveal.js';

export default function ProductGrid({ products }) {
  const gridRef = useReveal({ max: 12 });

  if (!products.length) {
    return (
      <p className="m-0 rounded-lg border border-line bg-ivory p-7 text-center text-muted">
        No sarees match the selected filters.
      </p>
    );
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
