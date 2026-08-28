import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function Success() {
  const orderId = localStorage.getItem('lastOrderId');

  return (
    <section className="mx-auto w-[min(1160px,calc(100%-32px))] py-14 md:py-16">
      <div className="mx-auto max-w-[700px] px-5 py-14 text-center">
        <CheckCircle2 className="mx-auto mb-5 text-maroon" size={64} strokeWidth={1.5} />

        <span className="eyebrow">
          Payment Successful
        </span>

        <h1 className="mt-3 text-h1">Thank you for your order!</h1>

        <p className="mt-5 text-lg text-muted">Your order has been placed successfully.</p>

        {orderId && (
          <div className="mt-7 rounded-lg border border-line bg-ivory-soft p-5">
            <strong className="text-sm uppercase tracking-wide text-muted">Order Number</strong>
            <h2 className="mt-1 text-2xl font-semibold text-maroon">{orderId}</h2>
          </div>
        )}

        <p className="mt-6">
          Estimated delivery: <strong>3-7 Business Days</strong>
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/collections"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-maroon px-6 font-semibold text-ivory transition-all hover:-translate-y-0.5 hover:bg-maroon-deep hover:shadow-soft"
          >
            Continue Shopping
          </Link>

          <Link
            to="/my-orders"
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-line bg-ivory px-6 font-semibold text-maroon transition-all hover:-translate-y-0.5 hover:border-maroon"
          >
            My Orders
          </Link>
        </div>
      </div>
    </section>
  );
}
