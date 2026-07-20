import { LogOut, Menu, ShoppingBag, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { getCartCount } from '../../utils/cart.js';
import { isLoggedIn, logout } from '../../services/customerAuth.js';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Collections', to: '/collections' },
  { label: 'My Orders', to: '/my-orders' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    function refresh() {
      setCartCount(getCartCount());
    }

    refresh();
    window.addEventListener('cartUpdated', refresh);
    return () => window.removeEventListener('cartUpdated', refresh);
  }, []);

  useEffect(() => {
    function refreshAuth() {
      setLoggedIn(isLoggedIn());
    }

    refreshAuth();
    window.addEventListener('customerAuthChanged', refreshAuth);
    return () => window.removeEventListener('customerAuthChanged', refreshAuth);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ivory/90 backdrop-blur-md">
      <nav
        className="mx-auto flex min-h-[76px] w-[min(1160px,calc(100%-32px))] items-center justify-between"
        aria-label="Main navigation"
      >
        <NavLink
          className="font-display text-3xl text-maroon"
          to="/"
          onClick={() => setIsOpen(false)}
        >
          SILKWAVES
        </NavLink>

        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-ivory text-maroon transition-transform duration-200 hover:-translate-y-0.5 hover:border-maroon md:hidden"
          type="button"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div
          className={`${
            isOpen ? 'flex' : 'hidden'
          } absolute inset-x-4 top-[76px] flex-col items-stretch gap-4 rounded-lg border border-line bg-ivory p-5 shadow-soft md:static md:flex md:flex-row md:items-center md:gap-7 md:border-none md:bg-transparent md:p-0 md:shadow-none`}
        >
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide text-muted transition-colors duration-200 hover:text-maroon ${
                  isActive ? 'text-maroon' : ''
                }`
              }
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          {loggedIn ? (
            <button
              type="button"
              aria-label="Log out"
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-ivory text-maroon transition-transform duration-200 hover:-translate-y-0.5 hover:border-maroon"
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate('/');
              }}
            >
              <LogOut size={19} />
            </button>
          ) : (
            <Link
              to="/login"
              aria-label="Log in"
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-ivory text-maroon transition-transform duration-200 hover:-translate-y-0.5 hover:border-maroon"
              onClick={() => setIsOpen(false)}
            >
              <User size={19} />
            </Link>
          )}

          <Link
            to="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-ivory text-maroon transition-transform duration-200 hover:-translate-y-0.5 hover:border-maroon"
            onClick={() => setIsOpen(false)}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
