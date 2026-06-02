import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaLeaf,
  FaShoppingBag,
  FaArrowRight,
  FaTruck,
  FaLock,
  FaCheckCircle,
} from 'react-icons/fa';
import { SiVisa, SiMastercard, SiPaypal } from 'react-icons/si';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';
import { useToast, ToastContainer } from '../components/Toast';
import { getProductName } from '../config/productTranslations';

const CartPage = () => {
  const { cart, loading, error, updateCartItem, removeFromCart, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [modal, setModal] = useState({ isOpen: false, type: 'info', title: '', message: '', buttons: [] });

  useEffect(() => {
    if (user?.address) {
      setShippingInfo({
        address: user.address.street || '',
        city: user.address.city || '',
        postalCode: user.address.postalCode || '',
        country: user.address.country || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock) {
      showToast('Більше немає на складі', 'warning');
      return;
    }
    try {
      await updateCartItem(item._id, newQuantity);
    } catch (err) {
      showToast(err.message || 'Не вдалося оновити кількість', 'error');
    }
  };

  const handleRemoveItem = (itemId, productName) => {
    setModal({
      isOpen: true,
      type: 'warning',
      title: 'Видалити товар?',
      message: `Ви впевнені, що хочете видалити "${productName}" з кошика?`,
      buttons: [
        {
          label: 'Скасувати',
          variant: 'secondary',
          onClick: () => {},
        },
        {
          label: 'Видалити',
          variant: 'danger',
          onClick: async () => {
            try {
              await removeFromCart(itemId);
              showToast('Товар видалено з кошика', 'success');
            } catch (err) {
              showToast('Не вдалося видалити товар', 'error');
            }
          },
        },
      ],
    });
  };

  const handleClearCart = () => {
    setModal({
      isOpen: true,
      type: 'warning',
      title: 'Очистити кошик?',
      message: 'Це видалить усі товари з вашого кошика. Ця дія не можна скасувати.',
      buttons: [
        {
          label: 'Скасувати',
          variant: 'secondary',
          onClick: () => {},
        },
        {
          label: 'Очистити',
          variant: 'danger',
          onClick: async () => {
            try {
              await clearCart();
              showToast('Кошик очищено', 'success');
            } catch (err) {
              showToast('Не вдалося очистити кошик', 'error');
            }
          },
        },
      ],
    });
  };

  const validateCheckout = () => {
    if (!user) {
      setModal({
        isOpen: true,
        type: 'warning',
        title: 'Увійти в систему',
        message: 'Будь ласка, увійдіть в систему для оформлення замовлення.',
        buttons: [
          { label: 'Скасувати', variant: 'secondary', onClick: () => {} },
          {
            label: 'Перейти до входу',
            onClick: () => navigate('/login'),
            closeOnClick: false,
          },
        ],
      });
      return false;
    }

    if (!cart?.items?.length) {
      setModal({
        isOpen: true,
        type: 'warning',
        title: 'Кошик порожній',
        message: 'Додайте товари до кошика для оформлення замовлення.',
        buttons: [
          {
            label: 'Перейти до каталогу',
            onClick: () => navigate('/catalog'),
            closeOnClick: false,
          },
        ],
      });
      return false;
    }

    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.country) {
      showToast('Будь ласка, заповніть всю інформацію про доставку', 'error');
      return false;
    }

    const unavailableItem = cart.items.find((item) => item.quantity > item.product.stock);
    if (unavailableItem) {
      showToast(
        `На складі доступно лише ${unavailableItem.product.stock} шт. товару ${getProductName(unavailableItem.product)}`,
        'error'
      );
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (!validateCheckout()) return;

    try {
      // Prepare order data
      const orderData = {
        shippingAddress: shippingInfo,
        paymentMethod,
        items: cart.items.map((item) => ({
          product: item.product._id,
          name: getProductName(item.product),
          image: item.product.image,
          quantity: item.quantity,
          price: item.price,
        })),
        total: getCartTotal(),
      };

      // Create order via API
      const { data } = await axios.post('/api/v1/orders', orderData);

      if (data.success) {
        // Show success modal
        setModal({
          isOpen: true,
          type: 'success',
          title: '✅ Замовлення оформлено!',
          message: `Спасибо за покупку! Номер замовлення: ${data.data._id.slice(-6).toUpperCase()}.\nВи отримаєте конфірмацію на пошту.`,
          buttons: [
            {
              label: 'Перейти на головну',
              onClick: async () => {
                await clearCart();
                navigate('/');
              },
              closeOnClick: false,
            },
          ],
        });

        showToast('Замовлення успішно оформлено!', 'success');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Не вдалося оформити замовлення';
      showToast(errorMessage, 'error');
      setModal({
        isOpen: true,
        type: 'error',
        title: '❌ Помилка',
        message: errorMessage,
        buttons: [
          { label: 'ОК', onClick: () => {} },
        ],
      });
    }
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-32 pb-12"
      >
        <div className="container mx-auto px-6 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🛒
          </motion.div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Завантаження кошика...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-32 pb-12"
      >
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg text-red-500 font-semibold">{error}</p>
          <Link to="/catalog" className="inline-block mt-4 btn-primary">
            Повернутися до каталогу
          </Link>
        </div>
      </motion.div>
    );
  }

  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-32 pb-12"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
              Ваш кошик
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEmpty ? 'Кошик порожній' : `${cart.items.length} товарів`}
            </p>
          </motion.div>
        </motion.div>

        {/* Empty State */}
        {isEmpty ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-md mx-auto text-center"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-9xl mb-6"
              >
                🛒
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Ваш кошик порожній
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                Додайте улюблені товари до кошика та оформіть замовлення!
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <FaShoppingBag /> Переглянути товари
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Cart Items */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
              {cart.items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.product.image}
                        alt={getProductName(item.product)}
                        onError={(e) => {
                          e.target.src = '/placeholder-pet.svg';
                        }}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                    </motion.div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {getProductName(item.product)}
                          </h3>
                          {item.product.ecoFriendly && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="inline-flex items-center gap-1 mt-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-semibold"
                            >
                              <FaLeaf /> Еко
                            </motion.div>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 20 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveItem(item._id, getProductName(item.product))}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                        >
                          <FaTrash className="text-red-500 group-hover:text-red-600 text-lg" />
                        </motion.button>
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-primary">
                            {(item.price * item.quantity).toFixed(2)} ₴
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.price.toFixed(2)} ₴ за одиницю
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 p-1 rounded-full">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FaMinus className="text-sm" />
                          </motion.button>
                          <span className="w-8 text-center font-bold text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            aria-disabled={item.quantity >= item.product.stock}
                            className="w-8 h-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
                          >
                            <FaPlus className="text-sm" />
                          </motion.button>
                        </div>
                      </div>
                      <p className="mt-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Доступно на складі: {item.product.stock} шт.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Cart Actions */}
              <motion.div
                variants={itemVariants}
                className="flex gap-3 mt-8"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Продовжити покупки
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearCart}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <FaTrash /> Очистити кошик
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Sidebar - Checkout */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <motion.div
                className="sticky top-32 space-y-6"
              >
                {/* Order Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-lg">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Підсумок замовлення
                  </h2>

                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Проміжний підсумок</span>
                      <span className="font-semibold">{getCartTotal().toFixed(2)} ₴</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-2">
                        <FaTruck className="text-primary" />
                        Доставка
                      </span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        Безкоштовно
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">Всього</span>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {getCartTotal().toFixed(2)} ₴
                    </span>
                  </div>

                  {/* Trust Badges */}
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <FaLock className="text-green-600 dark:text-green-400 text-lg" />
                      Безпечна оплата
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <FaTruck className="text-primary text-lg" />
                      Швидка доставка
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <FaCheckCircle className="text-primary text-lg" />
                      Гарантія якості
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                    Адреса доставки
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Вулиця, будинок, квартира"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Місто"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Поштовий індекс"
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                        className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Країна"
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <input
                      type="tel"
                      placeholder="Телефон (необов'язково)"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                    Спосіб оплати
                  </h3>
                  <div className="space-y-3">
                    {[
                      { value: 'credit_card', label: 'Кредитна картка', icon: <SiVisa className="text-xl" /> },
                      { value: 'mastercard', label: 'Mastercard', icon: <SiMastercard className="text-xl" /> },
                      { value: 'paypal', label: 'PayPal', icon: <SiPaypal className="text-xl" /> },
                      { value: 'cash_on_delivery', label: 'Оплата при отриманні', icon: '💳' },
                    ].map((method) => (
                      <motion.label
                        key={method.value}
                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                        className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-all"
                      >
                        <input
                          type="radio"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5 accent-primary"
                        />
                        <span className="text-xl">{method.icon}</span>
                        <span className="flex-1 font-medium text-gray-900 dark:text-white">
                          {method.label}
                        </span>
                        {paymentMethod === method.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-accent"
                          />
                        )}
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(45, 125, 91, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <FaArrowRight /> Оформити замовлення
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        buttons={modal.buttons}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </motion.div>
  );
};

export default CartPage;
