import fixtureProducts from '../data/products.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getProducts() {
  // With no API URL configured, serve the local fixture. There is no dev or
  // staging database — the only one is production — so this is what lets the
  // storefront be built and tested without reading or writing live data.
  // Leave VITE_API_BASE_URL unset in .env.local to work this way.
  if (!API_BASE_URL) {
    return fixtureProducts;
  }

  const res = await fetch(`${API_BASE_URL}/products`);

  // Without this an error response falls through as JSON, and callers that
  // expect an array get an object — the failure then surfaces somewhere far
  // less obvious than here.
  if (!res.ok) {
    throw new Error(`Could not load products (${res.status})`);
  }

  return res.json();
}

export const categories = [
  'Type 1 Sarees',
  'Type 2 Sarees',
  'Type 3 Sarees'
];
