import { ArrowRight, Sparkles } from 'lucide-react';
import CategoryCard from '../components/category/CategoryCard.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import Button from '../components/ui/Button.jsx';
import useProducts from '../hooks/useProducts.js';
import { categories } from '../services/productService.js';

export default function Home() {
  const { products, status } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="section-shell hero__grid">
          <div className="hero__content">
            <span className="hero__kicker">
              <Sparkles size={18} /> Handpicked luxury sarees
            </span>
            <h1>SILKWAVES</h1>
            <p>
              Elegant sarees selected for weddings, festive evenings, and every moment that deserves a softer kind of grandeur.
            </p>
            <div className="hero__actions">
              <Button to="/collections">Shop Collections</Button>
              <Button to="/collections?category=Type%201" variant="secondary">
                Explore Type 1 <ArrowRight size={18} />
              </Button>
            </div>
          </div>
          <div className="hero__image" aria-label="Model wearing a luxury saree">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=90"
              alt="Luxury silk saree styling"
            />
          </div>
        </div>
      </section>

      <section className="section-shell page-section">
        <div className="section-heading">
          <span className="eyebrow">Curated edits</span>
          <h2>Shop by category</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category} category={category} />
          ))}
        </div>
      </section>

      <section className="page-section page-section--beige">
        <div className="section-shell">
          <div className="section-heading section-heading--row">
            <div>
              <span className="eyebrow">Featured</span>
              <h2>New arrivals</h2>
            </div>
            <Button to="/collections" variant="secondary">
              View all <ArrowRight size={18} />
            </Button>
          </div>
          {status === 'loading' ? <p className="empty-state">Loading featured sarees...</p> : <ProductGrid products={featuredProducts} />}
        </div>
      </section>
    </>
  );
}
