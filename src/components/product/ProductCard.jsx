import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/currency.js';

export default function ProductCard({ product }) {
  const image = product.coverImage || product.galleryImages?.[0] || '';

  return (
    <article className="group overflow-hidden rounded-lg border border-line bg-ivory shadow-[0_12px_28px_rgba(32,26,21,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-soft">
      <Link className="block aspect-[4/5] overflow-hidden bg-ivory-soft" to={`/product/${product._id}`}>
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={image}
          alt={product.title}
          loading="lazy"
        />
      </Link>

      <div className="p-[18px]">
        <span className="inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-widest text-maroon">
          {product.category}
        </span>

        <h3 className="my-2 text-lg leading-snug">
          <Link to={`/product/${product._id}`}>{product.title}</Link>
        </h3>

        <p className="m-0 font-bold text-maroon">{formatPrice(product.price)}</p>

        {product.stock <= 0 ? (
          <span className="mt-1 inline-block text-sm font-semibold text-red-700">Out of Stock</span>
        ) : product.stock <= 5 ? (
          <span className="mt-1 inline-block text-sm font-semibold text-amber-700">
            Only {product.stock} left
          </span>
        ) : null}
      </div>
    </article>
  );
}
