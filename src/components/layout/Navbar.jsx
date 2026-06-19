import { Menu, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Collections', to: '/collections' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="navbar section-shell" aria-label="Main navigation">
        <NavLink className="brand" to="/" onClick={() => setIsOpen(false)}>
          SILKWAVES
        </NavLink>

        <button
          className="icon-button navbar__toggle"
          type="button"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`navbar__links ${isOpen ? 'navbar__links--open' : ''}`}>
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <button className="icon-button" type="button" aria-label="Shopping bag">
            <ShoppingBag size={21} />
          </button>
        </div>
      </nav>
    </header>
  );
}
