import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Eye, Heart } from 'lucide-react';
import { formatPrice } from '../../utils/currency.js';
import { isLoggedIn } from '../../services/customerAuth.js';
import { initWishlist, isWishlisted, addToWishlist, removeFromWishlist } from '../../services/wishlist.js';
import QuickViewModal from './QuickViewModal.jsx';

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

  const hasDiscount = product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

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

  return (
    <article
      className="group overflow-hidden rounded-lg border border-line bg-ivory shadow-[0_12px_28px_rgba(32,26,21,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-soft"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        className="relative block aspect-[4/5] overflow-hidden bg-ivory-soft"
        to={`/product/${product._id}`}
      >
        {images.map((src, index) => (
          <img
            key={src + index}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            src={src}
            alt={product.title}
            loading="lazy"
          />
        ))}

        {hasDiscount && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-red-700 px-2.5 py-1 text-[0.72rem] font-semibold text-white">
            -{discountPercent}%
          </span>
        )}

        {hasSlideshow && (
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
            {images.map((src, index) => (
              <span
                key={src + index}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
                  index === activeIndex ? 'bg-ivory' : 'bg-ivory/50'
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute right-3 top-3 z-10 flex translate-y-1 flex-col gap-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            disabled={wishlistBusy}
            className={`grid h-9 w-9 place-items-center rounded-full border backdrop-blur-md transition-all duration-200 ${
              wishlisted
                ? 'border-maroon bg-maroon text-ivory'
                : 'border-white/50 bg-ivory/70 text-ink hover:border-maroon hover:text-maroon'
            }`}
            onClick={toggleWishlist}
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>

          <button
            type="button"
            aria-label="Quick view"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/50 bg-ivory/70 text-ink backdrop-blur-md transition-all duration-200 hover:border-maroon hover:text-maroon"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsQuickViewOpen(true);
            }}
          >
            <Eye size={17} />
          </button>
        </div>
      </Link>

      {isQuickViewOpen && (
        <QuickViewModal product={product} onClose={() => setIsQuickViewOpen(false)} />
      )}

      <div className="p-[18px]">
        <span className="inline-flex items-center gap-2 eyebrow">
          {product.category}
        </span>

        <h3 className="my-2 text-lg leading-snug">
          <Link to={`/product/${product._id}`}>{product.title}</Link>
        </h3>

        <p className="m-0 flex items-baseline gap-2">
          <span className="font-semibold tabular-nums text-maroon">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-sm tabular-nums text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </p>

        {product.stock <= 0 ? (
          <span className="mt-1 inline-block text-sm font-semibold text-red-700">Out of Stock</span>
        ) : product.stock <= 5 ? (
          <span className="mt-1 inline-block text-sm font-semibold text-amber-700">
            Only {product.stock} left
          </span>
        ) : null}
      </div>
    </article>
  );
}
