import { getCustomerToken, isLoggedIn, logout } from './customerAuth.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let wishlistIds = new Set();
let initialized = false;

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getCustomerToken()}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    logout();
    throw new Error('Session expired, please log in again');
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

function setWishlistIds(products) {
  wishlistIds = new Set(products.map((p) => p._id));
  window.dispatchEvent(new Event('wishlistUpdated'));
}

export async function initWishlist() {
  if (initialized || !isLoggedIn()) return;
  initialized = true;

  try {
    const products = await getWishlist();
    setWishlistIds(products);
  } catch (err) {
    initialized = false;
    console.error(err);
  }
}

export function isWishlisted(productId) {
  return wishlistIds.has(productId);
}

export function getWishlist() {
  return request('/customer/wishlist');
}

export async function addToWishlist(productId) {
  const products = await request('/customer/wishlist', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });

  setWishlistIds(products);

  return products;
}

export async function removeFromWishlist(productId) {
  const products = await request(`/customer/wishlist/${productId}`, {
    method: 'DELETE',
  });

  setWishlistIds(products);

  return products;
}

export function resetWishlistCache() {
  wishlistIds = new Set();
  initialized = false;
  window.dispatchEvent(new Event('wishlistUpdated'));
}

if (typeof window !== 'undefined') {
  window.addEventListener('customerAuthChanged', () => {
    resetWishlistCache();
    initWishlist();
  });
}
