import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Eye, Heart } from 'lucide-react';
import { formatPrice } from '../../utils/currency.js';
import { getDiscount } from '../../utils/pricing.js';
import { resolveColor } from '../../data/colors.js';
import SaleBadge from '../ui/SaleBadge.jsx';
import { isLoggedIn } from '../../services/customerAuth.js';
import { initWishlist, isWishlisted, addToWishlist, removeFromWishlist } from '../../services/wishlist.js';
import QuickViewModal from './QuickViewModal.jsx';
import GalleryDots from './GalleryDots.jsx';

const SLIDE_INTERVAL_MS = 900;

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const images = [product.coverImage, ...(product.galleryImages || [])].filter(Boolean);
  const hasSlideshow = images.length > 1;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(isWishlisted(product._id));
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const intervalRef = useRef(null);

  const { hasDiscount, percent: discountPercent, compareAt } = getDiscount(product);
  const stock = Number(product.stock);
  const colors = (product.colors ?? []).map(resolveColor);

  useEffect(() => {
    initWishlist();

    function refresh() {
      setWishlisted(isWishlisted(product._id));
    }

    refresh();
    window.addEventListener('wishlistUpdated', refresh);
    return () => window.removeEventListener('wishlistUpdated', refresh);
  }, [product._id]);

  useEffect(() => {
    if (!isHovering || !hasSlideshow) return undefined;

    intervalRef.current = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalRef.current);
  }, [isHovering, hasSlideshow, images.length]);

  function handleMouseLeave() {
    setIsHovering(false);
    setActiveIndex(0);
  }

  async function toggleWishlist(event) {
    // Layered over the stretched link, so the click must not reach it.
    event.preventDefault();
    event.stopPropagation();

    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    if (wishlistBusy) return;
    setWishlistBusy(true);

    try {
      if (wishlisted) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setWishlistBusy(false);
    }
  }

  // Square, like everything else on the card. The circle is reserved for the
  // sale seal, which is meant to read as a struck object rather than a control.
  const actionButton =
    'grid h-8 w-8 place-items-center border backdrop-blur-md transition-colors duration-200 ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

  return (
    // No chrome and no fillet: a hard-edged photograph with the details set
    // beneath it as a small, wide-tracked label and a precise price.
    <article
      className="group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-ivory-soft">
        {/* Hover scales the image rather than lifting the article: useReveal
            leaves an inline transform on every grid child, and that outranks a
            Tailwind translate on the same element. */}
        {images.map((src, index) => (
          <img
            key={src + index}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04] ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            src={src}
            alt={product.title}
            loading="lazy"
          />
        ))}

        <SaleBadge percent={discountPercent} className="absolute left-3 top-3 z-20" />

        <Link
          className="absolute inset-0 z-0"
          to={`/product/${product._id}`}
          aria-label={product.title}
        />

        <div className="absolute right-3 top-3 z-20 flex translate-y-1 flex-col gap-1.5 opacity-0 transition-all duration-200 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            disabled={wishlistBusy}
            className={`${actionButton} ${
              wishlisted
                ? 'border-maroon bg-maroon text-ivory'
                : 'border-glass-edge bg-glass-strong text-ink hover:border-maroon hover:text-maroon'
            }`}
            onClick={toggleWishlist}
          >
            <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Quick view"
            className={`${actionButton} border-glass-edge bg-glass-strong text-ink hover:border-maroon hover:text-maroon`}
            onClick={() => setIsQuickViewOpen(true)}
          >
            <Eye size={15} aria-hidden="true" />
          </button>
        </div>

        <GalleryDots
          count={images.length}
          activeIndex={activeIndex}
          className="absolute inset-x-0 bottom-3 z-20"
        />
      </div>

      {isQuickViewOpen && (
        <QuickViewModal product={product} onClose={() => setIsQuickViewOpen(false)} />
      )}

      <div className="pt-3.5">
        <h3 className="m-0 font-body text-[0.7rem] font-medium uppercase leading-snug tracking-[0.12em] text-ink">
          <Link className="transition-colors hover:text-maroon" to={`/product/${product._id}`}>
            {product.title}
          </Link>
        </h3>

        {/* Numerals get their own treatment: tabular so prices line up down the
            column, and a hair of tracking so the digits are not cramped. */}
        <p className="m-0 mt-2 flex items-baseline gap-2">
          <span className="text-[0.9rem] tabular-nums tracking-[0.02em] text-ink">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-[0.75rem] tabular-nums text-muted line-through">
                {formatPrice(compareAt)}
              </span>
              <span className="text-[0.7rem] font-medium tabular-nums text-sale">
                −{discountPercent}%
              </span>
            </>
          )}
        </p>

        {colors.length > 0 && (
          <ul className="m-0 mt-2.5 flex list-none gap-1.5 p-0">
            {colors.map((color) => (
              <li key={color.slug}>
                <span
                  title={color.name}
                  className="block h-2.5 w-2.5 border border-black/15"
                  style={{
                    backgroundColor: color.hex ?? 'transparent',
                    backgroundImage: color.hex
                      ? undefined
                      : 'linear-gradient(135deg, var(--color-ivory-soft) 45%, var(--color-muted) 55%)',
                  }}
                />
                <span className="sr-only">{color.name}</span>
              </li>
            ))}
          </ul>
        )}

        {stock <= 0 ? (
          <span className="mt-2 inline-block text-[0.7rem] font-medium uppercase tracking-[0.1em] text-stock-out">
            Out of Stock
          </span>
        ) : stock <= 5 ? (
          <span className="mt-2 inline-block text-[0.7rem] font-medium uppercase tracking-[0.1em] text-stock-low">
            Only {stock} left
          </span>
        ) : null}
      </div>
    </article>
  );
}
