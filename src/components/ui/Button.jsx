import { Link } from 'react-router-dom';

const variants = {
  primary:
    'bg-maroon text-ivory hover:bg-maroon-deep hover:-translate-y-0.5 hover:shadow-soft',
  secondary:
    'border border-line bg-ivory text-maroon hover:border-maroon hover:-translate-y-0.5',
  gold: 'bg-gold text-ink hover:bg-gold-soft hover:-translate-y-0.5',
};

export default function Button({
  children,
  className = '',
  to,
  type = 'button',
  variant = 'primary',
  disabled = false,
  ...props
}) {
  const classes = `inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 font-semibold tracking-wide transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none ${variants[variant]} ${className}`.trim();

  if (to) {
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
