const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  return res.json();
}