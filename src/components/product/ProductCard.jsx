import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/currency.js';

export default function ProductCard({ product }) {
  const image = product.images?.[0] ?? '';

  return (
    <article className="product-card">
      <Link className="product-card__media" to={`/product/${product.slug}`}>
        <img src={image} alt={product.title} loading="lazy" />
      </Link>
      <div className="product-card__content">
        <span className="eyebrow">{product.category}</span>
        <h3>
          <Link to={`/product/${product.slug}`}>{product.title}</Link>
        </h3>
        <p>{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
