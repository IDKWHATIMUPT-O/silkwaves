import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import CategoryCard from '../components/category/CategoryCard.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import Button from '../components/ui/Button.jsx';
import useProducts from '../hooks/useProducts.js';
import useReveal from '../hooks/useReveal.js';
import { categories } from '../services/productService.js';

export default function Home() {
  const { products, status } = useProducts();
  const featuredProducts = products.slice(0, 4);
  const heroRef = useRef(null);
  const categoryGridRef = useReveal({ max: 6 });

  useEffect(() => {
    if (!heroRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    animate(heroRef.current.querySelectorAll('[data-reveal]'), {
      opacity: [0, 1],
      translateY: [20, 0],
      delay: (_, i) => i * 90,
      duration: 420,
      easing: 'easeOutQuad',
    });
  }, []);

  return (
    <>
      <section className="overflow-hidden bg-gradient-to-r from-ivory-soft to-ivory">
        <div
          ref={heroRef}
          className="mx-auto grid min-h-[calc(100vh-76px)] w-[min(1160px,calc(100%-32px))] items-center gap-10 py-12 md:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)] md:gap-14"
        >
          <div className="max-w-[590px]" data-reveal>
            <span className="inline-flex items-center gap-2 eyebrow">
              <Sparkles size={18} /> Handpicked luxury sarees
            </span>
            <h1 className="font-display mt-4 mb-2 text-display leading-[0.95] text-maroon">
              SILKWAVES
            </h1>
            <p className="max-w-[560px] text-lead leading-relaxed text-muted">
              Elegant sarees selected for weddings, festive evenings, and every moment that
              deserves a softer kind of grandeur.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Button to="/collections">Shop Collections</Button>
              <Button to="/collections?category=Type%201" variant="secondary">
                Explore Type 1 <ArrowRight size={18} />
              </Button>
            </div>
          </div>
          <div
            className="relative overflow-hidden rounded-lg shadow-soft"
            aria-label="Model wearing a luxury saree"
            data-reveal
          >
            <img
              className="h-[min(720px,76vh)] w-full object-cover"
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=90"
              alt="Luxury silk saree styling"
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-maroon/20" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1160px,calc(100%-32px))] py-16 md:py-22">
        <div className="mb-7">
          <span className="eyebrow">
            Curated edits
          </span>
          <h2 className="mt-2 text-h1">Shop by category</h2>
        </div>
        <div ref={categoryGridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-ivory-soft py-16 md:py-22">
        <div className="mx-auto w-[min(1160px,calc(100%-32px))]">
          <div className="mb-7 flex flex-col items-start gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">
                Featured
              </span>
              <h2 className="mt-2 text-h1">New arrivals</h2>
            </div>
            <Button to="/collections" variant="secondary">
              View all <ArrowRight size={18} />
            </Button>
          </div>
          {status === 'loading' ? (
            <p className="m-0 rounded-lg border border-line bg-ivory p-7 text-center text-muted">
              Loading featured sarees...
            </p>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}
        </div>
      </section>
    </>
  );
}
