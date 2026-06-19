import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService.js';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setStatus('loading');
      try {
        const data = await getProducts();
        if (isMounted) {
          setProducts(data);
          setStatus('success');
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setStatus('error');
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, status, error };
}
