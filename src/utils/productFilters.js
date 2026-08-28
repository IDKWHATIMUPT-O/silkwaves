import { resolveColor } from '../data/colors.js';
import { getDiscount } from './pricing.js';

// A saree counts as a new arrival for this long after createdAt. The field has
// existed on every product all along and was never read by anything.
export const NEW_WINDOW_DAYS = 30;

const createdTime = (product) => {
  const t = new Date(product?.createdAt ?? 0).getTime();
  return Number.isFinite(t) ? t : 0;
};

export const PRODUCT_SORTS = [
  { value: 'featured', label: 'Featured', compare: null },
  { value: 'newest', label: 'New arrivals', compare: (a, b) => createdTime(b) - createdTime(a) },
  { value: 'price-asc', label: 'Price: low to high', compare: (a, b) => a.price - b.price },
  { value: 'price-desc', label: 'Price: high to low', compare: (a, b) => b.price - a.price },
  {
    value: 'discount',
    label: 'Biggest discount',
    compare: (a, b) => getDiscount(b).percent - getDiscount(a).percent,
  },
];

// A threshold, not a range. A two-ended discount slider reads precisely but
// nobody shops that way — "30% off or more" is the question people actually ask.
export const DISCOUNT_BUCKETS = [10, 20, 30, 40];

export const AVAILABILITY = [
  { value: 'in-stock', label: 'In stock', test: (p) => Number(p.stock) > 0 },
  { value: 'low-stock', label: 'Only a few left', test: (p) => Number(p.stock) > 0 && Number(p.stock) <= 5 },
];

export const DEFAULT_FILTERS = {
  sort: 'featured',
  categories: [],
  colors: [],
  minPrice: null,
  maxPrice: null,
  minDiscount: 0,
  availability: [],
  newOnly: false,
};

const uniq = (arr) => [...new Set(arr)];
const toList = (raw) => (raw || '').split(',').map((s) => s.trim()).filter(Boolean);

function toInt(raw) {
  if (raw === null || raw === undefined || raw === '') return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

export function isNewArrival(product, now = Date.now()) {
  const t = createdTime(product);
  if (!t) return false;
  return now - t <= NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * Facets come from the products themselves, never a hardcoded list. That is
 * what lets the colour group hide itself entirely until the backend ships the
 * field, and it retires the duplicated `categories` export in productService.
 */
export function deriveFacets(products, now = Date.now()) {
  const list = Array.isArray(products) ? products : [];

  const categoryCounts = new Map();
  const colorCounts = new Map();
  let min = Infinity;
  let max = -Infinity;
  let maxDiscount = 0;
  let hasNew = false;

  for (const product of list) {
    if (product?.category) {
      categoryCounts.set(product.category, (categoryCounts.get(product.category) ?? 0) + 1);
    }
    for (const slug of uniq(product?.colors ?? [])) {
      colorCounts.set(slug, (colorCounts.get(slug) ?? 0) + 1);
    }
    const price = Number(product?.price);
    if (Number.isFinite(price)) {
      min = Math.min(min, price);
      max = Math.max(max, price);
    }
    maxDiscount = Math.max(maxDiscount, getDiscount(product).percent);
    if (isNewArrival(product, now)) hasNew = true;
  }

  return {
    categories: [...categoryCounts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value)),
    colors: [...colorCounts.entries()]
      .map(([slug, count]) => ({ ...resolveColor(slug), count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    priceBounds: {
      min: Number.isFinite(min) ? Math.floor(min) : 0,
      max: Number.isFinite(max) ? Math.ceil(max) : 0,
    },
    maxDiscount,
    hasNew,
  };
}

export function parseFilters(searchParams) {
  const get = (key) => searchParams.get(key);

  const sortParam = get('sort');
  const sort = PRODUCT_SORTS.some((s) => s.value === sortParam) ? sortParam : DEFAULT_FILTERS.sort;

  const discountParam = Number(get('minDiscount'));
  const minDiscount = DISCOUNT_BUCKETS.includes(discountParam) ? discountParam : 0;

  return {
    sort,
    categories: uniq(toList(get('category'))),
    colors: uniq(toList(get('color'))),
    minPrice: toInt(get('minPrice')),
    maxPrice: toInt(get('maxPrice')),
    minDiscount,
    // Unknown values are dropped rather than filtering everything to nothing.
    availability: uniq(toList(get('avail'))).filter((v) => AVAILABILITY.some((a) => a.value === v)),
    newOnly: get('new') === '1',
  };
}

/**
 * Params are omitted at their default, preserving the delete-on-default
 * contract the page already had — otherwise every shared link accumulates
 * seven no-op parameters.
 */
export function serializeFilters(filters) {
  const params = new URLSearchParams();
  if (filters.sort && filters.sort !== DEFAULT_FILTERS.sort) params.set('sort', filters.sort);
  if (filters.categories?.length) params.set('category', filters.categories.join(','));
  if (filters.colors?.length) params.set('color', filters.colors.join(','));
  if (Number.isFinite(filters.minPrice)) params.set('minPrice', String(filters.minPrice));
  if (Number.isFinite(filters.maxPrice)) params.set('maxPrice', String(filters.maxPrice));
  if (filters.minDiscount) params.set('minDiscount', String(filters.minDiscount));
  if (filters.availability?.length) params.set('avail', filters.availability.join(','));
  if (filters.newOnly) params.set('new', '1');
  return params;
}

/** Cross-facet is AND; within a facet it is OR. The standard shopping contract. */
export function applyFilters(products, filters, now = Date.now()) {
  const list = Array.isArray(products) ? products : [];
  const f = { ...DEFAULT_FILTERS, ...filters };

  const result = list.filter((product) => {
    if (f.categories.length && !f.categories.includes(product.category)) return false;

    if (f.colors.length) {
      const own = product?.colors ?? [];
      if (!f.colors.some((slug) => own.includes(slug))) return false;
    }

    const price = Number(product?.price);
    if (Number.isFinite(f.minPrice) && price < f.minPrice) return false;
    if (Number.isFinite(f.maxPrice) && price > f.maxPrice) return false;

    if (f.minDiscount && getDiscount(product).percent < f.minDiscount) return false;

    if (f.availability.length) {
      const matches = AVAILABILITY.filter((a) => f.availability.includes(a.value));
      if (!matches.some((a) => a.test(product))) return false;
    }

    if (f.newOnly && !isNewArrival(product, now)) return false;

    return true;
  });

  const sort = PRODUCT_SORTS.find((s) => s.value === f.sort);
  return sort?.compare ? [...result].sort(sort.compare) : result;
}

/** Sort is not a filter, so it is deliberately not counted. */
export function countActiveFilters(filters, bounds) {
  const f = { ...DEFAULT_FILTERS, ...filters };
  let n = f.categories.length + f.colors.length + f.availability.length;
  if (f.minDiscount) n += 1;
  if (f.newOnly) n += 1;
  const minChanged = Number.isFinite(f.minPrice) && (!bounds || f.minPrice > bounds.min);
  const maxChanged = Number.isFinite(f.maxPrice) && (!bounds || f.maxPrice < bounds.max);
  if (minChanged || maxChanged) n += 1;
  return n;
}
