import { useEffect, useState } from 'react';
import { formatPrice } from '../utils/currency.js';

const API = import.meta.env.VITE_API_BASE_URL;

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const phone = localStorage.getItem('customerPhone');

        const res = await fetch(`${API}/orders?phone=${phone}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto w-[min(1160px,calc(100%-32px))] py-16 text-center text-muted">
        Loading Orders...
      </div>
    );
  }

  return (
    <section className="mx-auto w-[min(1160px,calc(100%-32px))] py-14 md:py-16">
      <span className="text-xs font-extrabold uppercase tracking-widest text-maroon">My Orders</span>
      <h1 className="mt-2 mb-8 text-[clamp(2rem,5vw,3.2rem)] font-semibold">Order History</h1>

      {orders.length === 0 ? (
        <p className="m-0 rounded-lg border border-line bg-ivory p-7 text-center text-muted">
          No orders found.
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
