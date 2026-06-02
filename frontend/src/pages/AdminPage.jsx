import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  FaBox,
  FaCheck,
  FaEdit,
  FaEye,
  FaPaperPlane,
  FaSearch,
  FaShoppingBag,
  FaSpinner,
  FaTrash,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import OrderDetailsModal from '../components/OrderDetailsModal';
import ProductImageUpload from '../components/ProductImageUpload';
import { ToastContainer, useToast } from '../components/Toast';
import { getProductLabel, getProductName } from '../config/productTranslations';
import { getProductDescription } from '../config/productTranslations';
import {
  Field,
  inputClass,
  SelectField,
  StatCard,
  StockBadge,
  SubmitButton,
  TableSkeleton,
  ToggleSwitch,
} from '../components/AdminUi';

const EMPTY_PRODUCT = {
  name: '',
  description: '',
  price: '',
  category: 'Food',
  subcategory: '',
  petType: '',
  ageGroup: '',
  flavor: '',
  size: '',
  material: '',
  type: '',
  rating: '',
  reviews: '',
  image: '',
  stock: '',
  ecoFriendly: false,
};

const CATEGORIES = [
  ['Food', 'Корм'],
  ['Toys', 'Іграшки'],
  ['Accessories', 'Аксесуари'],
  ['Grooming', 'Догляд'],
  ['Health', "Здоров'я"],
  ['Eco-Friendly', 'Еко-товари'],
];

const OPTIONS = {
  flavor: ['Курка', 'Риба', 'Яловичина', 'Індичка'],
  ageGroup: ['Малюки', 'Дорослі', 'Літні'],
  petType: ['Коти', 'Собаки', 'Гризуни', 'Птахи'],
  size: ['Маленькі', 'Середні', 'Великі'],
  material: [{ value: 'Bamboo', label: 'Бамбук' }, { value: 'Wood', label: 'Дерево' }, { value: 'Organic cotton', label: 'Органічна бавовна' }, { value: 'Recycled plastic', label: 'Перероблений пластик' }],
  type: {
    Food: ['Сухий', 'Вологий', 'Ласощі', 'Натуральний'],
    Toys: ["М'ячики", 'Канати', 'Інтерактивні', 'Жувальні', 'Лазерні'],
    Grooming: ['Шампуні', 'Гребінці', 'Догляд за лапами', 'Гігієна', 'Засоби для шерсті'],
    Health: ['Вітаміни', 'Добавки', 'Для зубів', 'Для суглобів', 'Проти бліх'],
    'Eco-Friendly': [{ value: 'Eco toys', label: 'Еко-іграшки' }, { value: 'Eco bowls', label: 'Еко-миски' }, { value: 'Eco bags', label: 'Еко-пакети' }, { value: 'Recycled products', label: 'Перероблені товари' }],
  },
};

const DYNAMIC_FIELDS = {
  Food: ['flavor', 'petType', 'ageGroup', 'type'],
  Toys: ['size', 'petType', 'type'],
  Grooming: ['type'],
  Health: ['ageGroup', 'type'],
  'Eco-Friendly': ['material'],
};

const labels = {
  flavor: 'Смак',
  petType: 'Для кого',
  ageGroup: 'Вікова група',
  size: 'Розмір',
  material: 'Матеріал',
  type: 'Тип товару',
};

const getAllProducts = async () => {
  const first = await axios.get('/api/v1/products', { params: { page: 1, limit: 100 } });
  const products = [...(first.data.data || [])];
  for (let page = 2; page <= first.data.pages; page += 1) {
    const response = await axios.get('/api/v1/products', { params: { page, limit: 100 } });
    products.push(...(response.data.data || []));
  }
  return products;
};

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(false);
  const [search, setSearch] = useState('');
  const [productForm, setProductForm] = useState({ ...EMPTY_PRODUCT });
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [localImagePreview, setLocalImagePreview] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [allProducts, ordersResponse] = await Promise.all([
          getAllProducts(),
          axios.get('/api/v1/orders/admin'),
        ]);
        setProducts(allProducts);
        setOrders(ordersResponse.data.data || []);
      } catch (err) {
        showToast(err.response?.data?.error || 'Не вдалося завантажити дані адмін-панелі', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, showToast, user]);

  useEffect(() => setImageError(false), [productForm.image]);

  useEffect(() => () => {
    if (localImagePreview) URL.revokeObjectURL(localImagePreview);
  }, [localImagePreview]);

  const stats = useMemo(() => ({
    total: products.length,
    eco: products.filter((product) => product.ecoFriendly).length,
    outOfStock: products.filter((product) => product.stock < 1).length,
    categories: new Set(products.map((product) => product.category)).size,
  }), [products]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) =>
      getProductName(product).toLowerCase().includes(term) ||
      getProductLabel(product.category).toLowerCase().includes(term)
    );
  }, [products, search]);

  const dynamicFields = DYNAMIC_FIELDS[productForm.category] || [];

  const resetForm = () => {
    setProductForm({ ...EMPTY_PRODUCT });
    setEditingProduct(null);
    setImageError(false);
    setLocalImagePreview('');
  };

  const handleInputChange = ({ target }) => {
    const { name, value, type, checked } = target;
    if (name === 'category') {
      setProductForm((current) => ({
        ...current,
        category: value,
        flavor: '',
        petType: '',
        ageGroup: '',
        size: '',
        material: '',
        type: '',
      }));
      return;
    }
    if (name === 'image') setLocalImagePreview('');
    setProductForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (file) => {
    const preview = URL.createObjectURL(file);
    setLocalImagePreview(preview);
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', file);
      const response = await axios.post('/api/v1/upload/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProductForm((current) => ({ ...current, image: response.data.imageUrl }));
      showToast('Фото успішно завантажено');
    } catch (err) {
      setLocalImagePreview('');
      showToast(err.response?.data?.error || 'Не вдалося завантажити фото', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmitProduct = async (event) => {
    event.preventDefault();
    if (uploadingImage) {
      showToast('Зачекайте, поки фото завершить завантаження', 'warning');
      return;
    }
    try {
      setSubmitting(true);
      if (editingProduct) {
        const response = await axios.put(`/api/v1/products/${editingProduct._id}`, productForm);
        setProducts((current) => current.map((product) => product._id === editingProduct._id ? response.data.data : product));
        showToast('Товар успішно оновлено');
      } else {
        const response = await axios.post('/api/v1/products', productForm);
        setProducts((current) => [response.data.data, ...current]);
        showToast('Товар успішно додано');
      }
      resetForm();
    } catch (err) {
      showToast(err.response?.data?.error || 'Не вдалося зберегти товар', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({ ...EMPTY_PRODUCT, ...product, name: getProductName(product), description: getProductDescription(product) });
    setLocalImagePreview('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      setDeleting(true);
      await axios.delete(`/api/v1/products/${productToDelete._id}`);
      setProducts((current) => current.filter((product) => product._id !== productToDelete._id));
      showToast('Товар видалено');
      setProductToDelete(null);
    } catch (err) {
      showToast(err.response?.data?.error || 'Не вдалося видалити товар', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(`/api/v1/orders/${orderId}/status`, { status });
      setOrders((current) => current.map((order) => order._id === orderId ? { ...order, status } : order));
      showToast('Статус замовлення оновлено');
    } catch (err) {
      showToast(err.response?.data?.error || 'Не вдалося оновити статус замовлення', 'error');
    }
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      setDeletingOrder(true);
      await axios.delete(`/api/v1/orders/${orderToDelete._id}`);
      setOrders((current) => current.filter((order) => order._id !== orderToDelete._id));
      showToast('Замовлення видалено');
      setOrderToDelete(null);
    } catch (err) {
      showToast(err.response?.data?.error || 'Не вдалося видалити замовлення', 'error');
    } finally {
      setDeletingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50/40 px-4 py-8 sm:px-6 lg:px-8">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">EcoPetShop CMS</p>
            <h1 className="mt-2 flex items-center gap-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Панель керування {loading && <FaSpinner className="animate-spin text-xl text-primary" />}</h1>
            <p className="mt-2 text-sm text-slate-500">Керуйте асортиментом і замовленнями в одному місці.</p>
          </div>
          <div className="flex rounded-2xl border border-white bg-white/80 p-1 shadow-soft backdrop-blur">
            <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${activeTab === 'products' ? 'bg-primary text-white shadow-soft' : 'text-slate-500 hover:text-primary'}`}><FaBox /> Товари</button>
            <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${activeTab === 'orders' ? 'bg-primary text-white shadow-soft' : 'text-slate-500 hover:text-primary'}`}><FaShoppingBag /> Замовлення</button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Усього товарів" value={stats.total} type="products" />
          <StatCard title="Еко-товари" value={stats.eco} type="eco" />
          <StatCard title="Немає в наявності" value={stats.outOfStock} type="stock" />
          <StatCard title="Категорії" value={stats.categories} type="categories" />
        </div>

        {activeTab === 'products' ? (
          <>
            <section className="mb-8 rounded-3xl border border-white/80 bg-white/80 p-5 shadow-large backdrop-blur-xl sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{editingProduct ? 'Редагування' : 'Новий товар'}</p>
                  <h2 className="mt-1 text-2xl font-extrabold text-slate-900">{editingProduct ? getProductName(editingProduct) : 'Додати товар'}</h2>
                </div>
                {editingProduct && <button type="button" onClick={resetForm} className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 transition hover:bg-slate-100">Скасувати</button>}
              </div>

              <form onSubmit={handleSubmitProduct} className="grid gap-5 lg:grid-cols-[1fr_17rem]">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Назва товару"><input name="name" value={productForm.name} onChange={handleInputChange} className={inputClass} required /></Field>
                  <Field label="Категорія">
                    <select name="category" value={productForm.category} onChange={handleInputChange} className={inputClass}>
                      {CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </Field>
                  <Field label="Опис" className="sm:col-span-2"><textarea name="description" value={productForm.description} onChange={handleInputChange} className={inputClass} rows="3" required /></Field>
                  <Field label="Ціна, ₴"><input type="number" name="price" value={productForm.price} onChange={handleInputChange} className={inputClass} min="0" step="0.01" required /></Field>
                  <Field label="Кількість на складі"><input type="number" name="stock" value={productForm.stock} onChange={handleInputChange} className={inputClass} min="0" required /></Field>
                  <Field label="Підкатегорія"><input name="subcategory" value={productForm.subcategory} onChange={handleInputChange} className={inputClass} placeholder="Наприклад, ласощі" /></Field>
                  <Field label="URL зображення" hint="Можна залишити ручне посилання як резервний варіант."><input type="text" name="image" value={productForm.image} onChange={handleInputChange} className={inputClass} placeholder="https://... або /placeholder-pet.svg" /></Field>
                  {dynamicFields.map((field) => (
                    <SelectField key={field} label={labels[field]} name={field} value={productForm[field]} options={field === 'type' ? OPTIONS.type[productForm.category] : OPTIONS[field]} onChange={handleInputChange} />
                  ))}
                  <Field label="Рейтинг"><input type="number" name="rating" value={productForm.rating} onChange={handleInputChange} className={inputClass} min="0" max="5" step="0.1" /></Field>
                  <Field label="Кількість відгуків"><input type="number" name="reviews" value={productForm.reviews} onChange={handleInputChange} className={inputClass} min="0" /></Field>
                  <div className="sm:col-span-2">
                    <ToggleSwitch checked={productForm.ecoFriendly} onChange={(event) => handleInputChange({ target: { name: 'ecoFriendly', type: 'checkbox', checked: event.target.checked } })} label="Екологічний товар" description="Позначте товар як дружній до довкілля." />
                  </div>
                  <div className="flex flex-wrap gap-3 sm:col-span-2">
                    <SubmitButton busy={submitting} editing={Boolean(editingProduct)} />
                    {editingProduct && <button type="button" onClick={resetForm} className="btn-outline">Скасувати</button>}
                  </div>
                </div>

                <aside>
                  <ProductImageUpload
                    previewUrl={localImagePreview || (!imageError ? productForm.image : '')}
                    uploading={uploadingImage}
                    onSelectFile={handleImageUpload}
                    onValidationError={(message) => showToast(message, 'error')}
                    onPreviewError={() => setImageError(true)}
                  />
                </aside>
              </form>
            </section>

            <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-large backdrop-blur-xl">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                <div><h2 className="text-xl font-extrabold text-slate-900">Асортимент</h2><p className="mt-1 text-xs text-slate-400">Показано товарів: {filteredProducts.length}</p></div>
                <div className="relative w-full sm:max-w-xs">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Пошук товарів..." className={`${inputClass} pl-11`} />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-4">Товар</th><th className="px-5 py-4">Категорія</th><th className="px-5 py-4">Ціна</th><th className="px-5 py-4">Склад</th><th className="px-5 py-4 text-right">Дії</th></tr></thead>
                  {loading ? <TableSkeleton /> : (
                    <tbody>
                      {filteredProducts.map((product, index) => (
                        <tr key={product._id} className={`border-b border-slate-100 transition hover:bg-emerald-50/70 ${index % 2 ? 'bg-slate-50/40' : 'bg-white/40'}`}>
                          <td className="px-5 py-4"><div className="flex items-center gap-3"><img src={product.image || '/placeholder-pet.svg'} alt="" className="h-11 w-11 rounded-xl bg-emerald-50 object-cover" /><div><p className="max-w-xs truncate text-sm font-bold text-slate-800">{getProductName(product)}</p><p className="mt-1 text-xs text-slate-400">{getProductLabel(product.type || product.subcategory) || 'Без підкатегорії'}</p></div></div></td>
                          <td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">{getProductLabel(product.category)}</span></td>
                          <td className="px-5 py-4 text-sm font-extrabold text-primary">{Number(product.price).toFixed(2)} ₴</td>
                          <td className="px-5 py-4"><StockBadge stock={product.stock} /></td>
                          <td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => handleEditProduct(product)} className="rounded-xl bg-blue-50 p-3 text-blue-600 transition hover:bg-blue-100" title="Редагувати"><FaEdit /></button><button onClick={() => setProductToDelete(product)} className="rounded-xl bg-rose-50 p-3 text-rose-600 transition hover:bg-rose-100" title="Видалити"><FaTrash /></button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </section>
          </>
        ) : (
          <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-large backdrop-blur-xl">
            <div className="border-b border-slate-100 p-5"><h2 className="text-xl font-extrabold text-slate-900">Замовлення</h2><p className="mt-1 text-xs text-slate-400">Усього: {orders.length}</p></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-4">ID</th><th className="px-5 py-4">Клієнт</th><th className="px-5 py-4">Сума</th><th className="px-5 py-4">Статус</th><th className="px-5 py-4">Дата</th><th className="px-5 py-4 text-right">Дії</th></tr></thead>
                {loading ? <TableSkeleton columns={6} /> : (
                  <tbody>{orders.map((order, index) => <tr key={order._id} className={`border-b border-slate-100 transition hover:bg-emerald-50/70 ${index % 2 ? 'bg-slate-50/40' : ''}`}><td className="px-5 py-4 text-xs text-slate-400">{order._id}</td><td className="px-5 py-4"><p className="text-sm font-bold text-slate-800">{order.user?.name || 'Користувач'}</p><p className="mt-1 text-xs text-slate-400">{order.user?.email || 'Email не вказано'}</p></td><td className="px-5 py-4 text-sm font-bold text-primary">{Number(order.total).toFixed(2)} ₴</td><td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">{order.status}</span></td><td className="px-5 py-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString('uk-UA')}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => setSelectedOrder(order)} className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-200" title="Деталі"><FaEye /><span>Деталі</span></button><button disabled={order.status !== 'pending'} onClick={() => handleStatusChange(order._id, 'processing')} className="rounded-xl bg-blue-50 p-3 text-blue-600 transition disabled:cursor-not-allowed disabled:opacity-35" title="В обробці"><FaEdit /></button><button disabled={order.status === 'cancelled' || order.status === 'delivered'} onClick={() => handleStatusChange(order._id, 'shipped')} className="rounded-xl bg-amber-50 p-3 text-amber-600 transition disabled:cursor-not-allowed disabled:opacity-35" title="Відправити"><FaPaperPlane /></button><button disabled={order.status === 'cancelled' || order.status === 'delivered'} onClick={() => handleStatusChange(order._id, 'delivered')} className="rounded-xl bg-emerald-50 p-3 text-emerald-600 transition disabled:cursor-not-allowed disabled:opacity-35" title="Доставлено"><FaCheck /></button><button onClick={() => setOrderToDelete(order)} className="rounded-xl bg-rose-50 p-3 text-rose-600 transition hover:bg-rose-100" title="Видалити"><FaTrash /></button></div></td></tr>)}</tbody>
                )}
              </table>
            </div>
          </section>
        )}
      </div>

      <Modal isOpen={Boolean(productToDelete)} title="Видалити товар?" message={`Товар «${getProductName(productToDelete)}» буде видалено без можливості відновлення.`} type="warning" onClose={() => !deleting && setProductToDelete(null)} buttons={[{ label: 'Скасувати', variant: 'secondary' }, { label: deleting ? 'Видалення...' : 'Видалити', variant: 'danger', closeOnClick: false, onClick: confirmDeleteProduct }]} />
      <Modal isOpen={Boolean(orderToDelete)} title="Видалити замовлення?" message={`Замовлення ${orderToDelete?._id || ''} буде видалено без можливості відновлення.`} type="warning" onClose={() => !deletingOrder && setOrderToDelete(null)} buttons={[{ label: 'Скасувати', variant: 'secondary' }, { label: deletingOrder ? 'Видалення...' : 'Видалити', variant: 'danger', closeOnClick: false, onClick: confirmDeleteOrder }]} />
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
};

export default AdminPage;
