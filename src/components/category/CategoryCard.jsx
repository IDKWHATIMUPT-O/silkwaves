import { Link } from 'react-router-dom';

const categoryImages = {
  'Type 1': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
  'Type 2': 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=85',
  'Type 3': 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=85',
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
        alt={`${category} sarees`}
        loading="lazy"
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
      <span className="absolute bottom-5 left-5 z-10 text-xl font-semibold text-ivory">
        {category} Sarees
      </span>
    </Link>
  );
}
