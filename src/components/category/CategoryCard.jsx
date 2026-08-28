import { Link } from 'react-router-dom';

// Keyed by the full category string, which is what actually gets passed in.
// The old keys ("Type 1") never matched, so every src resolved to undefined.
// The Type 2 image was also a dead URL returning 404.
const categoryImages = {
  'Type 1 Sarees': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
  'Type 2 Sarees': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85',
  'Type 3 Sarees': 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=85',
};

export default function CategoryCard({ category }) {
  return (
    <Link
      className="group relative block min-h-[300px] overflow-hidden rounded-lg shadow-[0_12px_30px_rgba(32,26,21,0.1)] md:min-h-[360px]"
      to={`/collections?category=${encodeURIComponent(category)}`}
    >
      <img
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        src={categoryImages[category]}
        alt=""
        loading="lazy"
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
      <span className="absolute bottom-5 left-5 z-10 text-xl font-semibold text-ivory">
        {category}
      </span>
    </Link>
  );
}
