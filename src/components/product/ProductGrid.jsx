import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products }) {
  if (!products.length) {
    return <p className="empty-state">No sarees match the selected filters.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
