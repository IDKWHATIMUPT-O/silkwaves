import { Link } from 'react-router-dom';

export default function Button({
  children,
  className = '',
  to,
  type = 'button',
  variant = 'primary',
  ...props
}) {
  const classes = `button button--${variant} ${className}`.trim();

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
