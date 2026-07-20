import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Eye } from 'lucide-react';
import { formatPrice } from '../../utils/currency.js';
import QuickViewModal from './QuickViewModal.jsx';

const SLIDE_INTERVAL_MS = 900;

export default function ProductCard({ product }) {
  const images = [product.coverImage, ...(product.galleryImages || [])].filter(Boolean);
  const hasSlideshow = images.length > 1;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const intervalRef = useRef(null);

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

        <button
          type="button"
          aria-label="Quick view"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 translate-y-1 place-items-center rounded-full border border-white/50 bg-ivory/70 text-ink opacity-0 backdrop-blur-md transition-all duration-200 hover:border-maroon hover:text-maroon group-hover:translate-y-0 group-hover:opacity-100"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setIsQuickViewOpen(true);
          }}
        >
          <Eye size={17} />
        </button>
      </Link>

      {isQuickViewOpen && (
        <QuickViewModal product={product} onClose={() => setIsQuickViewOpen(false)} />
      )}

      <div className="p-[18px]">
        <span className="inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-widest text-maroon">
          {product.category}
        </span>

        <h3 className="my-2 text-lg leading-snug">
          <Link to={`/product/${product._id}`}>{product.title}</Link>
        </h3>

        <p className="m-0 font-bold text-maroon">{formatPrice(product.price)}</p>

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
