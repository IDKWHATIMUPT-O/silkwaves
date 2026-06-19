import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid.jsx';
import Button from '../components/ui/Button.jsx';
import { formatPrice } from '../utils/currency.js';

const API = import.meta.env.VITE_API_BASE_URL;

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API}/products`);
      const data = await res.json();

      const found = data.find((p) => p.id === id);
      setProduct(found);

      if (found?.coverImage) {
        setActiveImage(found.coverImage);
      }
    }

    load();
  }, [id]);

  const mainImage = activeImage || product?.coverImage || null;

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return [];
  }, [product]);

  if (!product) {
    return <div>Loading...</div>;
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
        </div>

        <div className="product-info">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.title}</h1>
          <p>{formatPrice(product.price)}</p>
          <p>{product.description}</p>

          <Button>
            <ShoppingBag size={19} /> Add to cart
          </Button>
        </div>
      </div>
    </section>
  );
}