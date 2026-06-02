import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { FaCartPlus, FaLeaf, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { getProductDescription, getProductLabel, getProductName } from '../config/productTranslations';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/v1/products/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        setError('Не вдалося завантажити деталі товару');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (product.stock < 1) {
      alert('Немає в наявності');
      return;
    }
    try {
      await addToCart(id, quantity);
      alert('Товар додано до кошика!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Не вдалося додати товар до кошика');
    }
  };

  const incrementQuantity = () => {
    if (quantity >= product.stock) {
      alert('Більше немає на складі');
      return;
    }
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">Завантаження деталей товару...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">Товар не знайдено</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={product.image || '/placeholder-pet.svg'}
              alt={getProductName(product)}
              className="w-full h-96 md:h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-primary">{getProductName(product)}</h1>
              {product.ecoFriendly && (
                <div className="eco-badge flex items-center space-x-1">
                  <FaLeaf />
                  <span>Еко-товари</span>
                </div>
              )}
            </div>

            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalfAlt />
              </div>
              <span className="text-gray-600">4.7 (128 відгуків)</span>
            </div>

            <p className="text-3xl font-bold text-primary mb-6">
              {product.price.toFixed(2)} ₴
            </p>

            <p className="text-gray-700 mb-6">{getProductDescription(product)}</p>

            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Категорія:</span> {getProductLabel(product.category)}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Наявність:</span> {product.stock} шт.
              </p>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={decrementQuantity}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2 border-l border-r border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock < 1}
                className="btn-primary ml-4 flex items-center space-x-2 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <FaCartPlus />
                <span>{product.stock < 1 ? 'Немає в наявності' : 'До кошика'}</span>
              </button>
            </div>

            <div className="border-t pt-4">
              <Link to="/cart" className="btn-outline">
                Перейти до кошика
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Деталі товару</h3>
        <p className="text-gray-700">
          {getProductDescription(product)} Цей екологічний продукт виготовлено зі сталих матеріалів
          і призначений для безпеки ваших вихованців та навколишнього середовища.
        </p>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
