import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { formatPrice } from '../utils/currency.js';

const API = import.meta.env.VITE_API_BASE_URL;

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await fetch(`${API}/products`);
        const data = await res.json();

        console.log("URL ID:", id);
        console.log("API DATA:", data);

        const found = data.find(
          (p) => String(p.id) === String(id) || String(p._id) === String(id)
        );

        setProduct(found || null);

        if (found?.coverImage) {
          setActiveImage(found.coverImage);
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const mainImage = activeImage || product?.coverImage || null;

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return [];
  }, [product]);

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="empty-state">
        Product not found
      </div>
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
        </div>

        <div className="product-info">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.title}</h1>
          <p>{formatPrice(product.price)}</p>
          <p>{product.description}</p>
          <div className="gallery-thumbnails">
            {product.galleryImages?.map((img) => (
              <img
                key={img}
                src={img}
                alt={product.title}
                onClick={() => setActiveImage(img)}
              />
            ))}
          </div>
          <Button>
            <ShoppingBag size={19} /> Add to cart
          </Button>
        </div>
      </div>
    </section>
  );
}