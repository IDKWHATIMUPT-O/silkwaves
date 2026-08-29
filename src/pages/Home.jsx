import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CategoryCard from '../components/category/CategoryCard.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import MandalaHero from '../components/home/MandalaHero.jsx';
import FeaturedArrival from '../components/home/FeaturedArrival.jsx';
import useProducts from '../hooks/useProducts.js';
import useReveal from '../hooks/useReveal.js';
import { applyFilters } from '../utils/productFilters.js';
import { categories } from '../services/productService.js';

export default function Home() {
  const { products, status } = useProducts();
  const categoryGridRef = useReveal({ max: 6 });

  // Newest first, so the window display is genuinely the latest piece rather
  // than whatever happens to sit first in the collection.
  const newestFirst = applyFilters(products, { sort: 'newest' });
  const featured = newestFirst[0] ?? null;
  const rest = newestFirst.slice(1, 5);

  return (
    <>
      <MandalaHero />

      {status === 'success' && <FeaturedArrival product={featured} />}

      <section className="mx-auto w-[min(1160px,calc(100%-32px))] py-20 md:py-28">
        <div className="mb-10 max-w-lg">
          <span className="eyebrow">Curated edits</span>
          <h2 className="mt-3 text-h1">Shop by category</h2>
        </div>

        <div ref={categoryGridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-ivory-soft py-20 md:py-28">
        <div className="mx-auto w-[min(1160px,calc(100%-32px))]">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-lg">
              <span className="eyebrow">Just in</span>
              <h2 className="mt-3 text-h1">New arrivals</h2>
            </div>

            <Link
              to="/collections?sort=newest"
              className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.22em] text-maroon transition-colors hover:text-maroon-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              View all
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          {status === 'loading' || status === 'idle' ? (
            <p className="m-0 border border-line bg-ivory p-7 text-center text-muted">
              Loading featured sarees…
            </p>
          ) : (
            <ProductGrid products={rest} emptyMessage="New pieces are on their way." />
          )}
        </div>
      </section>
    </>
  );
}
