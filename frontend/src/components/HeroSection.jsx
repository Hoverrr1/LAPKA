import { Link } from 'react-router-dom';
import { FaPaw, FaLeaf, FaShoppingBag, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="py-20 pt-32 md:pt-40 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{ float: [0, 30, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-10 left-10 text-6xl opacity-10"
      >
        <FaPaw />
      </motion.div>
      <motion.div
        animate={{ float: [0, -30, 0] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        className="absolute bottom-20 right-10 text-5xl opacity-10"
      >
        <FaLeaf />
      </motion.div>

      {/* Gradient blobs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 180] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-20 right-0 w-72 h-72 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-3xl -z-10"
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], rotate: [180, 90, 0] }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-green-200/20 to-emerald-200/20 rounded-full blur-3xl -z-10"
      />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-block mb-6"
            >
              <span className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-primary dark:text-green-300 px-4 py-2 rounded-full text-sm font-semibold">
                <FaStar className="text-yellow-400" /> Преміальні еко-товари
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-6xl xl:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6"
            >
              Еко-товари для{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                щасливих улюбленців
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-xl mb-10 leading-relaxed"
            >
              Преміальні, екологічні та безпечні продукти для собак та котів. 
              Обирайте стійкі рішення для улюбленців та планети.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex gap-8 mb-12"
            >
              <div>
                <p className="text-3xl font-bold text-primary">5000+</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Задоволених клієнтів</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">⭐ 4.9/5</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Рейтинг якості</p>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/catalog"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all"
                >
                  <FaShoppingBag /> Перейти в каталог
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/catalog?ecoFriendly=true"
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary hover:text-white transition-all"
                >
                  <FaLeaf /> Еко-товари
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right side - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            {/* Main visual container */}
            <motion.div
              className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-green-50/80 to-white dark:from-gray-700/80 dark:to-gray-800 p-8 shadow-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              {/* Logo/Image */}
              <motion.div
                className="aspect-square flex items-center justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <img
                  src="/logo.png"
                  alt="EcoPetShop"
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/placeholder-pet.svg';
                  }}
                />
              </motion.div>

              {/* Floating eco badge */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg text-white text-3xl"
              >
                🌱
              </motion.div>

              {/* Floating paw badge */}
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg text-white text-2xl"
              >
                🐾
              </motion.div>
            </motion.div>

            {/* Card floating effect */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg backdrop-blur-sm border border-white/20 dark:border-gray-700/20 max-w-xs"
            >
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Чому вибрати нас?</p>
              <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                <li>✓ 100% біорозкладні</li>
                <li>✓ Безпечно для тварин</li>
                <li>✓ Схвалено ветеринарами</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;