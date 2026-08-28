import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { animate } from 'animejs';
import { ShoppingBag, X } from 'lucide-react';
import { formatPrice } from '../../utils/currency.js';
import { addToCart } from '../../utils/cart.js';

const GALLERY_INTERVAL_MS = 2200;
const CLOSE_ANIMATION_MS = 200;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function QuickViewModal({ product, onClose }) {
  const [added, setAdded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  const backdropRef = useRef(null);
  const panelRef = useRef(null);

  const images = [product.coverImage, ...(product.galleryImages || [])].filter(Boolean);
  const hasSlideshow = images.length > 1;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (prefersReducedMotion()) {
      if (backdropRef.current) backdropRef.current.style.opacity = 1;
      if (panelRef.current) {
        panelRef.current.style.opacity = 1;
        panelRef.current.style.transform = 'scale(1)';
      }
    } else {
      animate(backdropRef.current, {
        opacity: [0, 1],
        duration: 220,
        easing: 'easeOutQuad',
      });

      animate(panelRef.current, {
        opacity: [0, 1],
        scale: [0.86, 1],
        duration: 380,
        easing: 'easeOutBack',
      });
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') handleClose();
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasSlideshow) return undefined;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, GALLERY_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [hasSlideshow, images.length]);

  function handleClose() {
    if (isClosing) return;
    setIsClosing(true);

    if (prefersReducedMotion()) {
      onClose();
      return;
    }

    animate(backdropRef.current, {
      opacity: [1, 0],
      duration: CLOSE_ANIMATION_MS,
      easing: 'easeInQuad',
    });

    animate(panelRef.current, {
      opacity: [1, 0],
      scale: [1, 0.9],
      duration: CLOSE_ANIMATION_MS,
      easing: 'easeInQuad',
    });

    window.setTimeout(onClose, CLOSE_ANIMATION_MS);
  }

  return createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4 opacity-0 backdrop-blur-lg"
      onClick={handleClose}
    >
      <div
        ref={panelRef}
        className="relative grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-lg border border-white/50 bg-ivory/55 opacity-0 shadow-soft backdrop-blur-2xl sm:grid-cols-2"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close quick view"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/60 bg-ivory/50 text-ink backdrop-blur-md transition-colors hover:border-maroon hover:text-maroon"
          onClick={handleClose}
        >
          <X size={18} />
        </button>

        <div className="relative aspect-[4/5] bg-ivory-soft/60 sm:aspect-auto">
          {images.map((src, index) => (
            <img
              key={src + index}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                index === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
              src={src}
              alt={product.title}
            />
          ))}

          {hasSlideshow && (
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
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
        </div>

        <div className="flex flex-col gap-3 p-6">
          <span className="eyebrow">
            {product.category}
          </span>

          <h2 className="m-0 text-2xl font-semibold leading-snug">{product.title}</h2>

          <p className="m-0 text-xl font-semibold tabular-nums text-maroon">{formatPrice(product.price)}</p>

          {product.description && (
            <p className="m-0 line-clamp-4 text-sm leading-relaxed text-muted">{product.description}</p>
          )}

          {product.stock <= 0 ? (
            <span className="text-sm font-semibold text-red-700">Out of Stock</span>
          ) : product.stock <= 5 ? (
            <span className="text-sm font-semibold text-amber-700">Only {product.stock} left</span>
          ) : null}

          <div className="mt-2 flex flex-col gap-2.5">
            <button
              type="button"
              disabled={product.stock <= 0}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-maroon px-6 font-semibold text-ivory transition-all hover:-translate-y-0.5 hover:bg-maroon-deep hover:shadow-soft disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              onClick={() => {
                addToCart(product);
                setAdded(true);
                window.setTimeout(() => setAdded(false), 1600);
              }}
            >
              <ShoppingBag size={18} />
              {product.stock <= 0 ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
            </button>

            <Link
              to={`/product/${product._id}`}
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-line bg-ivory/50 px-6 font-semibold text-maroon backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-maroon"
              onClick={handleClose}
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
