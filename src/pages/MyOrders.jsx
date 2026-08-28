import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/currency.js';
import { getMyOrders, isLoggedIn } from '../services/customerAuth.js';

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    async function load() {
      try {
        const data = await getMyOrders();
        setOrders(data);
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
  }, [navigate]);

  if (loading) {
    return (
      <div className="mx-auto w-[min(1160px,calc(100%-32px))] py-16 text-center text-muted">
        Loading Orders...
      </div>
    );
  }

  return (
    <section className="mx-auto w-[min(1160px,calc(100%-32px))] py-14 md:py-16">
      <span className="eyebrow">My Orders</span>
      <h1 className="mt-2 mb-8 text-h1">Order History</h1>

      {error && (
        <p className="mb-6 rounded-lg border border-line bg-ivory p-4 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      {orders.length === 0 ? (
        <p className="m-0 rounded-lg border border-line bg-ivory p-7 text-center text-muted">
          No orders found.{' '}
          <Link className="font-semibold text-maroon underline-offset-2 hover:underline" to="/collections">
            Start shopping
          </Link>
        </p>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-line bg-ivory p-6">
              <h3 className="mb-3 text-lg font-semibold text-maroon">{order.id}</h3>
              <p className="m-0 mb-1">Payment: {order.payment}</p>
              <p className="m-0 mb-1">Status: {order.status}</p>
              <p className="m-0 mb-1">Amount: {formatPrice(order.amount)}</p>
              <p className="m-0 mb-1">AWB: {order.awb || 'Not Generated'}</p>
              <p className="m-0">Courier: {order.courier}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
