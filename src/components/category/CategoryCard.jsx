import { Link } from 'react-router-dom';

const categoryImages = {
  'Type 1': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
  'Type 2': 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=85',
  'Type 3': 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=85',
};

export default function CategoryCard({ category }) {
  return (
    <Link className="category-card" to={`/collections?category=${encodeURIComponent(category)}`}>
      <img src={categoryImages[category]} alt={`${category} sarees`} loading="lazy" />
      <span>{category} Sarees</span>
    </Link>
  );
}
