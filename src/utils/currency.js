const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

// Guarded because this now also receives computed values (a discount's `saved`
// amount), and because a live API can hand back a null or a string price.
// Unguarded, Intl renders those as "₹NaN" straight into the page.
export function formatPrice(price) {
  // null/undefined/'' mean "no price", which is not the same as zero —
  // Number(null) is 0, so these have to be rejected before the coercion.
  if (price === null || price === undefined || price === '') return '';
  const value = Number(price);
  if (!Number.isFinite(value)) return '';
  return inr.format(value);
}
