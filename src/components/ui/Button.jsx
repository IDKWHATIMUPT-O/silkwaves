import { Link } from 'react-router-dom';
import cx from '../../utils/cx.js';

const variants = {
  primary:
    'bg-maroon text-ivory hover:bg-maroon-deep hover:-translate-y-0.5 hover:shadow-soft',
  secondary:
    'border border-glass-edge bg-glass-strong text-maroon hover:border-maroon hover:-translate-y-0.5',
  gold: 'bg-gold text-ink hover:bg-gold-soft hover:-translate-y-0.5',
};

const sizes = {
  sm: 'min-h-10 px-4 text-meta',
  md: 'min-h-12 px-6',
};

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-control font-medium tracking-wide ' +
  'transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-50 ' +
  'disabled:hover:translate-y-0 disabled:hover:shadow-none';

export default function Button({
  children,
  className = '',
  to,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  ...props
}) {
  const classes = cx(BASE, sizes[size] ?? sizes.md, variants[variant] ?? variants.primary, className);

  if (to) {
    // A disabled link cannot simply drop `disabled` — an <a> ignores it and
    // stays fully clickable, which is what used to happen here. Render a real
    // disabled button instead so the state actually holds.
    if (disabled) {
      return (
        <button className={classes} type="button" disabled {...props}>
          {children}
        </button>
      );
    }
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
