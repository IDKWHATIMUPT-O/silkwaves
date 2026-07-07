import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/currency.js';

export default function ProductCard({ product }) {
const image =
product.coverImage ||
product.galleryImages?.[0] ||
'';

return ( <article className="product-card">
<Link
className="product-card__media"
to={`/product/${product._id}`}
> 
<img
       src={image}
       alt={product.title}
       loading="lazy"
     /> </Link>

```
  <div className="product-card__content">
    <span className="eyebrow">
      {product.category}
    </span>

    <h3>
      <Link
        to={`/product/${product._id}`}
      >
        {product.title}
      </Link>
    </h3>

    <p>
      {formatPrice(product.price)}
    </p>
    {product.stock <= 0 ? (

  <span
    style={{
      color: "#c62828",
      fontWeight: "600"
    }}
  >
    Out of Stock
  </span>

) : product.stock <= 5 ? (

  <span
    style={{
      color: "#ef6c00",
      fontWeight: "600"
    }}
  >
    Only {product.stock} left
  </span>

) : null}
  </div>
</article>
);
}
