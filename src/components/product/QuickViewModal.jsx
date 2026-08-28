import { createPortal } from 'react-dom';
import { useEffect, useId, useRef, useState } from 'react';
import { animate } from 'animejs';
import { ShoppingBag, X } from 'lucide-react';
import { formatPrice } from '../../utils/currency.js';
import { addToCart } from '../../utils/cart.js';
import { getDiscount } from '../../utils/pricing.js';
import Button from '../ui/Button.jsx';
import SaleBadge from '../ui/SaleBadge.jsx';
import GalleryDots from './GalleryDots.jsx';
import useFocusTrap from '../../hooks/useFocusTrap.js';
import useBodyScrollLock from '../../hooks/useBodyScrollLock.js';

const GALLERY_INTERVAL_MS = 2200;
const CLOSE_ANIMATION_MS = 200;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function QuickViewModal({ product, onClose }) {
  const [added, setAdded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  // A ref, not state. The Escape handler is registered once and closes over its
  // first render, where a state flag is permanently false -- so a second Escape
  // re-ran the exit animation and called onClose twice. A ref is the same object
  // every render, so this guard actually holds.
  const closingRef = useRef(false);

  const titleId = useId();
  const images = [product.coverImage, ...(product.galleryImages || [])].filter(Boolean);
  const discount = getDiscount(product);
  const outOfStock = Number(product.stock) <= 0;

  useBodyScrollLock(true);
  useFocusTrap(panelRef, true);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (backdropRef.current) backdropRef.current.style.opacity = '1';
      if (panelRef.current) panelRef.current.style.opacity = '1';
    } else {
      animate(backdropRef.current, { opacity: [0, 1], duration: 220, ease: 'outQuad' });
      animate(panelRef.current, {
        opacity: [0, 1],
        scale: [0.86, 1],
        duration: 380,
        ease: 'outBack',
      });
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') handleClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const id = setInterval(
      () => setActiveIndex((i) => (i + 1) % images.length),
      GALLERY_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [images.length]);

  function handleClose() {
    if (closingRef.current) return;
    closingRef.current = true;

    if (prefersReducedMotion()) {
      onClose();
      return;
    }

    animate(backdropRef.current, { opacity: [1, 0], duration: CLOSE_ANIMATION_MS, ease: 'inQuad' });
    animate(panelRef.current, {
      opacity: [1, 0],
      scale: [1, 0.9],
      duration: CLOSE_ANIMATION_MS,
      ease: 'inQuad',
    });
    setTimeout(onClose, CLOSE_ANIMATION_MS);
  }

  return createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4 opacity-0 backdrop-blur-lg"
      onMouseDown={handleClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        className="relative grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-panel border border-glass-edge bg-glass opacity-0 shadow-glass backdrop-blur-glass-lg sm:grid-cols-2"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close quick view"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-pill border border-glass-edge bg-glass-strong text-ink transition-colors hover:border-maroon hover:text-maroon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <X size={16} aria-hidden="true" />
        </button>

        <div className="relative aspect-[4/5] overflow-hidden bg-ivory-soft sm:aspect-auto">
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
          <GalleryDots
            count={images.length}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            className="absolute inset-x-0 bottom-3"
          />
        </div>

        <div className="flex flex-col gap-3 p-6">
          <span className="eyebrow">{product.category}</span>

          <h2 id={titleId} className="m-0 text-h3 leading-snug">
            {product.title}
          </h2>

          <div className="flex flex-wrap items-center gap-2.5">
            <p className="m-0 text-xl font-semibold tabular-nums text-maroon">
              {formatPrice(product.price)}
            </p>
            {discount.hasDiscount && (
              <>
                <p className="m-0 text-meta tabular-nums text-muted line-through">
                  {formatPrice(discount.compareAt)}
                </p>
                <SaleBadge percent={discount.percent} variant="ribbon" />
              </>
            )}
          </div>

          {discount.hasDiscount && (
            <SaleBadge percent={discount.percent} saved={discount.saved} variant="inline" />
          )}

          {product.description && (
            <p className="m-0 line-clamp-4 text-meta leading-relaxed text-muted">
              {product.description}
            </p>
          )}

          {outOfStock ? (
            <span className="text-meta font-medium text-stock-out">Out of Stock</span>
          ) : Number(product.stock) <= 5 ? (
            <span className="text-meta font-medium text-stock-low">Only {product.stock} left</span>
          ) : null}

          <div className="mt-2 flex flex-col gap-2.5">
            <Button
              disabled={outOfStock}
              onClick={() => {
                addToCart(product);
                setAdded(true);
                window.setTimeout(() => setAdded(false), 1600);
              }}
            >
              <ShoppingBag size={18} aria-hidden="true" />
              {outOfStock ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
            </Button>

            <Button variant="secondary" to={`/product/${product._id}`} onClick={handleClose}>
              View Full Details
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
