import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { FaBoxOpen, FaFilter, FaLeaf, FaSearch, FaTimes } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { categories, categoryNames, emptyFilters, filterConfig } from '../config/productFilters';

const PRICE_LIMIT = 2500;

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-soft">
    <div className="skeleton-loader h-64 rounded-none" />
    <div className="space-y-4 p-5">
      <div className="skeleton-loader h-5 w-4/5" />
      <div className="skeleton-loader h-4 w-2/5" />
      <div className="skeleton-loader h-10 w-full" />
    </div>
  </div>
);

const CheckOption = ({ checked, label, onChange }) => (
  <label className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm text-slate-600 transition hover:bg-emerald-50 hover:text-slate-900">
    <span>{label}</span>
    <input type="checkbox" checked={checked} onChange={onChange} className="filter-checkbox" />
  </label>
);

const FilterPanel = ({ category, filters, activeCount, onToggle, onChange, onClear, onClose }) => {
  const dynamicFilters = filterConfig[category] || [];

  return (
    <div className="h-full overflow-y-auto rounded-3xl border border-white/70 bg-white/80 p-5 shadow-large backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Параметри</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">Фільтри {activeCount > 0 && `(${activeCount})`}</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded-full bg-slate-100 p-3 text-slate-500" aria-label="Закрити фільтри">
            <FaTimes />
          </button>
        )}
      </div>

      {dynamicFilters.map((group) => (
        <div key={group.key} className="mb-5 border-b border-slate-100 pb-5">
          <h3 className="mb-2 text-sm font-bold text-slate-900">{group.label}</h3>
          {group.options.map((option) => (
            <CheckOption
              key={typeof option === 'string' ? option : option.value}
              label={typeof option === 'string' ? option : option.label}
              checked={filters[group.key].includes(typeof option === 'string' ? option : option.value)}
              onChange={() => onToggle(group.key, typeof option === 'string' ? option : option.value)}
            />
          ))}
        </div>
      ))}

      <div className="mb-5 border-b border-slate-100 pb-5">
        <div className="mb-3 flex items-center justify-between text-sm font-bold text-slate-900">
          <span>Ціна</span>
          <span className="text-primary">{filters.minPrice} - {filters.maxPrice} ₴</span>
        </div>
        <label className="mb-3 block text-xs text-slate-500">Мінімальна ціна</label>
        <input type="range" min="0" max={PRICE_LIMIT} step="50" value={filters.minPrice} onChange={(event) => onChange('minPrice', Number(event.target.value))} className="price-slider" />
        <label className="mb-3 mt-4 block text-xs text-slate-500">Максимальна ціна</label>
        <input type="range" min="0" max={PRICE_LIMIT} step="50" value={filters.maxPrice} onChange={(event) => onChange('maxPrice', Number(event.target.value))} className="price-slider" />
      </div>

      <div className="mb-5 border-b border-slate-100 pb-5">
        <h3 className="mb-3 text-sm font-bold text-slate-900">Рейтинг</h3>
        {[
          ['4', '★★★★☆ і вище'],
          ['3', '★★★☆☆ і вище'],
        ].map(([value, label]) => (
          <CheckOption key={value} label={label} checked={filters.rating === value} onChange={() => onChange('rating', filters.rating === value ? '' : value)} />
        ))}
      </div>

      <div className="space-y-1">
        <CheckOption label="В наявності" checked={filters.inStock} onChange={() => onChange('inStock', !filters.inStock)} />
        <CheckOption label="Тільки eco товари" checked={filters.ecoFriendly} onChange={() => onChange('ecoFriendly', !filters.ecoFriendly)} />
      </div>

      <button onClick={onClear} className="mt-6 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-primary hover:text-primary">
        Очистити фільтри
      </button>
    </div>
  );
};

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [filters, setFilters] = useState(() => ({
    ...emptyFilters,
    ecoFriendly: searchParams.get('ecoFriendly') === 'true',
  }));

  const requestParams = useMemo(() => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (category !== 'All') params.category = category;
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length) params[key] = value.join(',');
      if (!Array.isArray(value) && value !== '' && value !== false) params[key] = value;
    });
    return params;
  }, [category, filters, search]);

  const activeCount = useMemo(() => Object.entries(filters).reduce((total, [key, value]) => {
    if (Array.isArray(value)) return total + value.length;
    if (key === 'minPrice') return total + (value > 0 ? 1 : 0);
    if (key === 'maxPrice') return total + (value < PRICE_LIMIT ? 1 : 0);
    return total + (value ? 1 : 0);
  }, 0), [filters]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get('/api/v1/products', {
          params: requestParams,
          signal: controller.signal,
        });
        setProducts(response.data.data || []);
        setCount(response.data.count || 0);
        setSearchParams(requestParams, { replace: true });
      } catch (err) {
        if (controller.signal.aborted) return;
        setError('Не вдалося завантажити товари. Спробуйте ще раз.');
        console.error(err.response?.data || err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 180);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [requestParams, setSearchParams]);

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    setFilters((current) => ({
      ...emptyFilters,
      minPrice: current.minPrice,
      maxPrice: current.maxPrice,
      rating: current.rating,
      inStock: current.inStock,
      ecoFriendly: current.ecoFriendly,
    }));
  };

  const handleToggle = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  };

  const handleChange = (key, value) => {
    setFilters((current) => {
      if (key === 'minPrice') return { ...current, minPrice: Math.min(value, current.maxPrice) };
      if (key === 'maxPrice') return { ...current, maxPrice: Math.max(value, current.minPrice) };
      return { ...current, [key]: value };
    });
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setFilters({ ...emptyFilters });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50/50">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 rounded-4xl bg-gradient-to-r from-primary to-secondary px-6 py-8 text-white shadow-large md:px-10">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-100"><FaLeaf /> Каталог EcoPetShop</p>
          <h1 className="text-4xl font-extrabold md:text-5xl">Знайдіть найкраще для улюбленця</h1>
          <p className="mt-3 max-w-2xl text-emerald-50">Добірні товари, зручні категорії та точні фільтри для швидкого вибору.</p>
          <div className="relative mt-6 max-w-2xl">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Пошук за назвою або описом..." className="w-full rounded-2xl bg-white px-12 py-4 text-sm text-slate-900 outline-none ring-4 ring-white/20 placeholder:text-slate-400 focus:ring-white/40" />
          </div>
        </div>

        <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button key={item} onClick={() => handleCategoryChange(item)} className={`whitespace-nowrap rounded-full px-5 py-3 text-sm font-bold transition ${category === item ? 'bg-primary text-white shadow-medium' : 'bg-white text-slate-600 shadow-soft hover:text-primary'}`}>
              {categoryNames[item]}
            </button>
          ))}
        </div>

        <div className="mb-5 flex items-center justify-between lg:pl-[19rem]">
          <p className="text-sm font-semibold text-slate-500">Знайдено: <span className="text-slate-900">{count}</span></p>
          <button onClick={() => setDrawerOpen(true)} className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-primary shadow-soft lg:hidden">
            <FaFilter /> Фільтри {activeCount > 0 && `(${activeCount})`}
          </button>
        </div>

        <div className="grid gap-7 lg:grid-cols-[17rem_1fr]">
          <aside className="hidden lg:block">
            <FilterPanel category={category} filters={filters} activeCount={activeCount} onToggle={handleToggle} onChange={handleChange} onClear={clearFilters} />
          </aside>

          <main>
            {loading && products.length === 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
              </div>
            ) : error ? (
              <div className="rounded-3xl bg-white p-12 text-center text-red-500 shadow-soft">{error}</div>
            ) : products.length ? (
              <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }} className={`grid gap-5 transition-opacity duration-200 sm:grid-cols-2 xl:grid-cols-3 ${loading ? 'opacity-60' : 'opacity-100'}`}>
                {products.map((product) => (
                  <motion.div key={product._id} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="rounded-3xl border border-white bg-white/80 p-12 text-center shadow-soft">
                <FaBoxOpen className="mx-auto mb-4 text-6xl text-emerald-200" />
                <h2 className="text-2xl font-bold text-slate-900">Товарів не знайдено</h2>
                <p className="mt-2 text-sm text-slate-500">Спробуйте змінити параметри або очистити фільтри.</p>
                <button onClick={clearFilters} className="btn-primary mt-6">Показати всі товари</button>
              </div>
            )}
          </main>
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setDrawerOpen(false)}>
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 28 }} className="h-full w-[88%] max-w-sm p-3" onClick={(event) => event.stopPropagation()}>
              <FilterPanel category={category} filters={filters} activeCount={activeCount} onToggle={handleToggle} onChange={handleChange} onClear={clearFilters} onClose={() => setDrawerOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CatalogPage;
