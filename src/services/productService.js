import products from '../data/products.json';

const API_BASE_URL = "https://silkwaves-api.onrender.com";

async function request(endpoint) {
  if (!API_BASE_URL) return null;

  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function getProducts() {
  const apiProducts = await request('/products');
  return apiProducts ?? products;
}

export async function getProductBySlug(slug) {
  const collection = await getProducts();
  return collection.find((product) => product.slug === slug) ?? null;
}

export async function getProductById(id) {
  const apiProduct = await request(`/products/${id}`);
  if (apiProduct) return apiProduct;

  return products.find((product) => product.id === Number(id)) ?? null;
}

export const categories = ['Type 1', 'Type 2', 'Type 3'];
