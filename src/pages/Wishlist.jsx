import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { isLoggedIn } from '../services/customerAuth.js';
import { getWishlist } from '../services/wishlist.js';

export default function Wishlist() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    async function load() {
      try {
        const data = await getWishlist();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('Session expired')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    }

    load();

    function refresh() {
      load();
    }

    window.addEventListener('wishlistUpdated', refresh);
    return () => window.removeEventListener('wishlistUpdated', refresh);
  }, [navigate]);

  if (loading) {
    return (
      <div className="mx-auto w-[min(1160px,calc(100%-32px))] py-16 text-center text-muted">
        Loading your wishlist...
      </div>
    );
  }

  return (
    <section className="mx-auto w-[min(1160px,calc(100%-32px))] py-14 md:py-16">
      <span className="eyebrow">Saved</span>
      <h1 className="mt-2 mb-8 text-h1">My Wishlist</h1>

      {error && (
        <p className="mb-6 rounded-lg border border-line bg-ivory p-4 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      {products.length === 0 ? (
        <p className="m-0 rounded-lg border border-line bg-ivory p-7 text-center text-muted">
          Your wishlist is empty.{' '}
          <Link className="font-semibold text-maroon underline-offset-2 hover:underline" to="/collections">
            Start shopping
          </Link>
        </p>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  );
}
