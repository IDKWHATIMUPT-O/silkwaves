import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { formatPrice } from '../utils/currency.js';
import { addToCart } from '../utils/cart.js';
import { getProducts } from '../services/productService.js';

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        // Goes through productService rather than fetching directly, so this
        // page honours the local fixture like every other product surface. It
        // was fetching `${API}/products` with API empty, which returned the SPA
        // shell and made every product page render "Product not found".
        const data = await getProducts();

        const found = data.find(
          (p) => String(p.id) === String(id) || String(p._id) === String(id)
        );

        setProduct(found || null);

        if (found?.coverImage) {
          setActiveImage(found.coverImage);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const mainImage = activeImage || product?.coverImage || null;

  if (loading) {
    return (
      <div className="mx-auto w-[min(1160px,calc(100%-32px))] py-16 text-center text-muted">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto w-[min(1160px,calc(100%-32px))] py-16">
        <p className="m-0 rounded-lg border border-line bg-ivory p-7 text-center text-muted">
          Product not found
        </p>
      </div>
    );
  }

  return (
    <section className="mx-auto w-[min(1160px,calc(100%-32px))] py-14 md:py-16">
      <Link className="mb-6 inline-flex items-center gap-2 font-semibold text-maroon" to="/collections">
        <ArrowLeft size={18} /> Collections
      </Link>

      <div className="grid grid-cols-1 items-start gap-9 md:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] md:gap-13">
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-lg bg-ivory-soft shadow-soft">
            {mainImage && <img className="h-full w-full object-cover" src={mainImage} alt={product.title} />}
          </div>

          {product.galleryImages?.length > 0 && (
            <div className="mt-3.5 grid grid-cols-4 gap-3">
              {product.galleryImages.map((img) => (
                <button
                  key={img}
                  type="button"
                  className={`aspect-square overflow-hidden rounded-md border-2 p-0 ${
                    activeImage === img ? 'border-maroon' : 'border-transparent'
                  }`}
                  onClick={() => setActiveImage(img)}
                >
                  <img className="h-full w-full object-cover" src={img} alt={product.title} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:sticky md:top-24">
          <span className="eyebrow">
            {product.category}
          </span>
          <h1 className="my-2.5 text-h1 leading-tight">
            {product.title}
          </h1>
          <p className="mb-5 text-2xl font-semibold tabular-nums text-maroon">{formatPrice(product.price)}</p>
          <p className="mb-7 leading-relaxed text-muted">{product.description}</p>

          <Button
            className="w-full"
            disabled={product.stock <= 0}
            onClick={() => {
              addToCart(product);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1600);
            }}
          >
            <ShoppingBag size={19} />
            {product.stock <= 0 ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </section>
  );
}
