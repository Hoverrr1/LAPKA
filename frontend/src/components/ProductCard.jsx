import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCartPlus, FaHeart, FaLeaf, FaRegHeart, FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { getProductLabel, getProductName } from '../config/productTranslations';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const outOfStock = product.stock < 1;
  const rating = Math.round(product.rating || 0);

  const handleAddToCart = async (event) => {
    event.preventDefault();
    if (outOfStock) return;
    try {
      await addToCart(product._id, 1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const toggleWishlist = (event) => {
    event.preventDefault();
    setWishlisted((current) => !current);
  };

  return (
    <motion.article whileHover={{ y: -7 }} transition={{ duration: 0.25 }} className="group overflow-hidden rounded-3xl border border-white/80 bg-white shadow-soft transition-shadow hover:shadow-large">
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative h-60 overflow-hidden bg-emerald-50">
          <img src={imageError || !product.image ? '/placeholder-pet.svg' : product.image} alt={getProductName(product)} onError={() => setImageError(true)} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {product.ecoFriendly && <span className="eco-badge gap-1"><FaLeaf /> Еко</span>}
            {outOfStock && <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-white">Немає в наявності</span>}
          </div>
          <button onClick={toggleWishlist} className="absolute right-3 top-3 rounded-full bg-white/90 p-3 text-slate-500 shadow-soft backdrop-blur transition hover:text-red-500" aria-label="Додати до обраного">
            {wishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>
        </div>

        <div className="p-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">{getProductLabel(product.subcategory || product.category)}</p>
          <h3 className="min-h-[3.5rem] text-lg font-bold leading-snug text-slate-900 transition group-hover:text-primary">{getProductName(product)}</h3>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => <FaStar key={index} className={index < rating ? 'text-amber-400' : 'text-slate-200'} />)}
            </div>
            <span className="text-xs text-slate-400">{product.rating?.toFixed(1) || '0.0'} ({product.reviews || 0})</span>
          </div>
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="text-2xl font-extrabold text-primary">{product.price.toFixed(2)} ₴</span>
            <button onClick={handleAddToCart} disabled={outOfStock} className="rounded-2xl bg-primary p-3 text-white shadow-soft transition hover:bg-secondary disabled:cursor-not-allowed disabled:bg-slate-300" aria-label="Додати до кошика">
              <FaCartPlus />
            </button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ProductCard;
