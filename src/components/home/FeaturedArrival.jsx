import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { formatPrice } from '../../utils/currency.js';
import { getDiscount } from '../../utils/pricing.js';
import SaleBadge from '../ui/SaleBadge.jsx';

/**
 * One saree, at full height, immediately after the opening. The point of the
 * landing page is not to show everything — it is to show one thing properly,
 * the way a shop puts a single piece in the window.
 */
export default function FeaturedArrival({ product }) {
  if (!product) return null;

  const discount = getDiscount(product);

  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-ivory-soft">
      <img
        src={product.coverImage}
        alt={product.title}
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />

      {/* Reads from the bottom up so the type sits on the darkest part of the
          photograph, whatever the photograph happens to be. */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[88vh] w-[min(1160px,calc(100%-32px))] items-end pb-16 md:pb-24">
        <div className="max-w-xl">
          <span className="text-[0.68rem] uppercase tracking-[0.32em] text-gold-soft">
            New arrival
          </span>

          <h2 className="mt-4 text-balance font-display text-[clamp(2.4rem,6vw,4rem)] leading-[1.05] text-ivory">
            {product.title}
          </h2>

          {product.description && (
            <p className="mt-4 max-w-md text-pretty leading-relaxed text-ivory/85">
              {product.description}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="text-xl tabular-nums text-ivory">
              {formatPrice(product.price)}
            </span>
            {discount.hasDiscount && (
              <>
                <span className="text-meta tabular-nums text-ivory/60 line-through">
                  {formatPrice(discount.compareAt)}
                </span>
                <SaleBadge percent={discount.percent} variant="ribbon" />
              </>
            )}
          </div>

          <Link
            to={`/product/${product._id}`}
            className="mt-8 inline-flex min-h-12 items-center gap-2 border border-ivory/70 px-7 text-[0.72rem] uppercase tracking-[0.22em] text-ivory transition-colors duration-200 hover:bg-ivory hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            View this saree
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
