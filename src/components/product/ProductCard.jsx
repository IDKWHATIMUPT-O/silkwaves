import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Eye, Heart } from 'lucide-react';
import { formatPrice } from '../../utils/currency.js';
import { getDiscount } from '../../utils/pricing.js';
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

  const actionButton =
    'grid h-9 w-9 place-items-center rounded-pill border backdrop-blur-md transition-colors duration-200 ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

  return (
    // Editorial: no card chrome at all. The photograph is the object and the
    // type sits on the page beneath it, so nothing competes with the garment.
    <article
      className="group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-card bg-ivory-soft">
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

        <div className="absolute right-3 top-3 z-20 flex translate-y-1 flex-col gap-2 opacity-0 transition-all duration-200 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
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
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Quick view"
            className={`${actionButton} border-glass-edge bg-glass-strong text-ink hover:border-maroon hover:text-maroon`}
            onClick={() => setIsQuickViewOpen(true)}
          >
            <Eye size={17} aria-hidden="true" />
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

      <div className="px-1 pt-4">
        <span className="eyebrow">{product.category}</span>

        <h3 className="mb-2 mt-1.5 font-display text-2xl leading-tight">
          <Link className="transition-colors hover:text-maroon" to={`/product/${product._id}`}>
            {product.title}
          </Link>
        </h3>

        <p className="m-0 flex items-baseline gap-2.5">
          <span className="text-lg tabular-nums text-maroon">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-meta tabular-nums text-muted line-through">
              {formatPrice(compareAt)}
            </span>
          )}
        </p>

        {stock <= 0 ? (
          <span className="mt-1.5 inline-block text-meta font-medium text-stock-out">
            Out of Stock
          </span>
        ) : stock <= 5 ? (
          <span className="mt-1.5 inline-block text-meta font-medium text-stock-low">
            Only {stock} left
          </span>
        ) : null}
      </div>
    </article>
  );
}
