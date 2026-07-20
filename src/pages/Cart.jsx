import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from '../utils/cart.js';
import { formatPrice } from '../utils/currency.js';

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  function refreshCart() {
    setCart(getCart());
  }

  const total = cart.reduce((a, b) => a + Number(b.price) * b.quantity, 0);

  return (
    <section className="mx-auto w-[min(1160px,calc(100%-32px))] py-14 md:py-16">
      <span className="text-xs font-extrabold uppercase tracking-widest text-maroon">Shopping Cart</span>
      <h1 className="mt-2 mb-7 text-[clamp(2rem,5vw,3.2rem)] font-semibold">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="m-0 rounded-lg border border-line bg-ivory p-7 text-center text-muted">
          Your cart is empty
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cart.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-lg border border-line bg-ivory shadow-[0_12px_28px_rgba(32,26,21,0.06)]"
              >
                <div className="aspect-[4/5] overflow-hidden bg-ivory-soft">
                  <img className="h-full w-full object-cover" src={item.coverImage} alt={item.title} />
                </div>

                <div className="p-[18px]">
                  <span className="text-[0.72rem] font-bold uppercase tracking-widest text-maroon">
                    Qty: {item.quantity}
                  </span>
                  <h3 className="my-2 text-lg leading-snug">{item.title}</h3>
                  <p className="m-0 font-bold text-maroon">{formatPrice(item.price)}</p>

                  <div className="mt-4 flex items-center gap-2.5">
                    <button
                      className="min-h-9 min-w-9 rounded-md border border-line bg-ivory font-bold text-ink transition-colors hover:border-maroon"
                      onClick={() => {
                        decreaseQuantity(item.id);
                        refreshCart();
                      }}
                    >
                      -
                    </button>
                    <strong>{item.quantity}</strong>
                    <button
                      className="min-h-9 min-w-9 rounded-md border border-line bg-ivory font-bold text-ink transition-colors hover:border-maroon"
                      onClick={() => {
                        increaseQuantity(item.id);
                        refreshCart();
                      }}
                    >
                      +
                    </button>
                    <button
                      className="ml-auto text-sm font-semibold text-maroon underline-offset-2 hover:underline"
                      onClick={() => {
                        removeFromCart(item.id);
                        refreshCart();
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 border-t border-line pt-6">
            <div className="mb-2.5 flex justify-between">
              <span className="text-muted">Subtotal</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <div className="mb-5 flex justify-between">
              <span className="text-muted">Shipping</span>
              <strong>FREE</strong>
            </div>
            <div className="mb-6 flex justify-between text-xl">
              <strong>Total</strong>
              <strong className="text-maroon">{formatPrice(total)}</strong>
            </div>

            <div className="flex flex-col gap-3.5 sm:flex-row">
              <button
                className="min-h-12 rounded-md border border-line bg-ivory px-6 font-semibold text-ink transition-colors hover:border-maroon"
                onClick={() => {
                  clearCart();
                  refreshCart();
                }}
              >
                Clear Cart
              </button>

              <Link
                to="/checkout"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-maroon px-6 font-semibold text-ivory transition-all hover:-translate-y-0.5 hover:bg-maroon-deep hover:shadow-soft"
              >
                Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
