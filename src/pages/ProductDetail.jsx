import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid.jsx';
import Button from '../components/ui/Button.jsx';
import useProducts from '../hooks/useProducts.js';
import { formatPrice } from '../utils/currency.js';

export default function ProductDetail() {
  const { slug } = useParams();
  const { products, status } = useProducts();
  const product = products.find((item) => item.slug === slug);
  const [activeImage, setActiveImage] = useState('');
  const mainImage = activeImage || product?.images?.[0] || null;

  useEffect(() => {
    if (product?.images?.length) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  if (status === 'loading') {
    return <p className="empty-state page">Loading saree details...</p>;
  }

  if (!product) {
    return (
      <section className="section-shell page not-found">
        <span className="eyebrow">Product not found</span>
        <h1>This saree is unavailable</h1>
        <Button to="/collections">Return to collections</Button>
      </section>
    );
  }

  return (
    <section className="section-shell page">
      <Link className="back-link" to="/collections">
        <ArrowLeft size={18} /> Collections
      </Link>

      <div className="product-detail">
        <div className="gallery">
          <div className="gallery__main">
            {mainImage && <img src={mainImage} alt={product.title} />}
          </div>
          <div className="gallery__thumbs">
            {product.images.map((image) => (
              <button
                className={activeImage === image ? 'is-active' : ''}
                key={image}
                type="button"
                onClick={() => setActiveImage(image)}
                aria-label={`View ${product.title} image`}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info">
          <span className="eyebrow">{product.category} Sarees</span>
          <h1>{product.title}</h1>
          <p className="product-info__price">{formatPrice(product.price)}</p>
          <p className="product-info__description">{product.description}</p>
          <Button className="product-info__button">
            <ShoppingBag size={19} /> Add to cart
          </Button>
          <dl className="product-meta">
            <div>
              <dt>Category</dt>
              <dd>{product.category}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>Complimentary insured delivery</dd>
            </div>
            <div>
              <dt>Care</dt>
              <dd>Dry clean only</dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="related-section">
        <div className="section-heading">
          <span className="eyebrow">Related</span>
          <h2>You may also like</h2>
        </div>
        <ProductGrid products={relatedProducts} />
      </section>
    </section>
  );
}
