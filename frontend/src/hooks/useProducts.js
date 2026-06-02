import { useState, useEffect } from 'react';
import api from '../utils/api';
const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/v1/products', { params });
        setProducts(res.data.data);
        setCount(res.data.count);
        setPages(res.data.pages);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(params)]);

  return { products, loading, error, count, pages };
};

export default useProducts;