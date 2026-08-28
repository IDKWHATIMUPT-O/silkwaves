// One definition of "on sale". The rule previously existed twice — computed in
// ProductCard and re-derived independently in Sale.jsx — so the two could drift.
//
// Guarded with Number.isFinite rather than a bare comparison: `null > 5` happens
// to be false, but a live API can also return undefined or a numeric string,
// and those do not behave the same way.
export function getDiscount(product) {
  const price = Number(product?.price);
  const compareAt = Number(product?.compareAtPrice);

  const valid =
    Number.isFinite(price) &&
    Number.isFinite(compareAt) &&
    product?.compareAtPrice !== null &&
    product?.compareAtPrice !== undefined &&
    compareAt > price;

  if (!valid) {
    return { hasDiscount: false, percent: 0, saved: 0, price, compareAt: null };
  }

  return {
    hasDiscount: true,
    percent: Math.round((1 - price / compareAt) * 100),
    saved: compareAt - price,
    price,
    compareAt,
  };
}

export function isOnSale(product) {
  return getDiscount(product).hasDiscount;
}
